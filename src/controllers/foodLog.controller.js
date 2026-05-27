import FoodLog from '../models/FoodLog.js'
import Food from '../models/Food.js'

// GET /api/food-log?date=2026-05-17
export const getFoodLog = async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ success: false, message: 'date is required — format: YYYY-MM-DD' })
    }

    const logs = await FoodLog.find({ date }).sort({ loggedAt: 1 })

    // group by mealType
    const grouped = {
      breakfast:    [],
      lunch:        [],
      dinner:       [],
      pre_workout:  [],
      post_workout: [],
      snacks:       [],
    }

    logs.forEach(log => {
      if (grouped[log.mealType]) {
        grouped[log.mealType].push(log)
      }
    })

    // totals for the day
    const totals = logs.reduce(
      (acc, log) => {
        acc.kcal    += log.totalKcal
        acc.protein += log.totalProtein
        acc.carbs   += log.totalCarbs
        acc.fat     += log.totalFat
        return acc
      },
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    )

    // round totals
    totals.kcal    = Math.round(totals.kcal)
    totals.protein = Math.round(totals.protein)
    totals.carbs   = Math.round(totals.carbs)
    totals.fat     = Math.round(totals.fat)

    res.status(200).json({
      success: true,
      date,
      totals,
      grouped,
      all: logs,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/food-log
export const addFoodLog = async (req, res) => {
  try {
    const { foodId, mealType, servings, date } = req.body

    if (!foodId || !mealType || !servings || !date) {
      return res.status(400).json({
        success: false,
        message: 'foodId, mealType, servings, date are required',
      })
    }

    const food = await Food.findById(foodId)
    if (!food || food.isArchived) {
      return res.status(404).json({ success: false, message: 'Food not found' })
    }

    const log = await FoodLog.create({
      foodId,
      foodSnapshot: {
        name:    food.name,
        unit:    food.unit,
        kcal:    food.kcal,
        protein: food.protein,
        carbs:   food.carbs,
        fat:     food.fat,
      },
      mealType,
      servings,
      totalKcal:    Math.round(food.kcal    * servings),
      totalProtein: Math.round(food.protein * servings),
      totalCarbs:   Math.round(food.carbs   * servings),
      totalFat:     Math.round(food.fat     * servings),
      date,
    })

    res.status(201).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/food-log/:id
export const updateFoodLog = async (req, res) => {
  try {
    const log = await FoodLog.findById(req.params.id)
    if (!log) {
      return res.status(404).json({ success: false, message: 'Log entry not found' })
    }

    const { servings, mealType } = req.body

    if (mealType) log.mealType = mealType

    if (servings !== undefined) {
      log.servings     = servings
      log.totalKcal    = Math.round(log.foodSnapshot.kcal    * servings)
      log.totalProtein = Math.round(log.foodSnapshot.protein * servings)
      log.totalCarbs   = Math.round(log.foodSnapshot.carbs   * servings)
      log.totalFat     = Math.round(log.foodSnapshot.fat     * servings)
    }

    await log.save()

    res.status(200).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/food-log/:id
export const deleteFoodLog = async (req, res) => {
  try {
    const log = await FoodLog.findByIdAndDelete(req.params.id)
    if (!log) {
      return res.status(404).json({ success: false, message: 'Log entry not found' })
    }

    res.status(200).json({ success: true, message: 'Log entry deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/food-log/summary?date=2026-05-17
// used by dashboard — returns totals + progress vs goals
export const getDailySummary = async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ success: false, message: 'date is required' })
    }

    const logs = await FoodLog.find({ date })

    const totals = logs.reduce(
      (acc, log) => {
        acc.kcal    += log.totalKcal
        acc.protein += log.totalProtein
        acc.carbs   += log.totalCarbs
        acc.fat     += log.totalFat
        return acc
      },
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    )

    totals.kcal    = Math.round(totals.kcal)
    totals.protein = Math.round(totals.protein)
    totals.carbs   = Math.round(totals.carbs)
    totals.fat     = Math.round(totals.fat)

    res.status(200).json({
      success: true,
      date,
      totals,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/food-log/range?start=2026-05-11&end=2026-05-17
// for weekly progress chart
export const getFoodLogRange = async (req, res) => {
  try {
    const { start, end } = req.query

    if (!start || !end) {
      return res.status(400).json({ success: false, message: 'start and end dates are required' })
    }

    const logs = await FoodLog.find({
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 })

    // group by date
    const byDate = {}
    logs.forEach(log => {
      if (!byDate[log.date]) {
        byDate[log.date] = { kcal: 0, protein: 0, carbs: 0, fat: 0 }
      }
      byDate[log.date].kcal    += log.totalKcal
      byDate[log.date].protein += log.totalProtein
      byDate[log.date].carbs   += log.totalCarbs
      byDate[log.date].fat     += log.totalFat
    })

    // round each day
    Object.keys(byDate).forEach(d => {
      byDate[d].kcal    = Math.round(byDate[d].kcal)
      byDate[d].protein = Math.round(byDate[d].protein)
      byDate[d].carbs   = Math.round(byDate[d].carbs)
      byDate[d].fat     = Math.round(byDate[d].fat)
    })

    res.status(200).json({
      success: true,
      start,
      end,
      data: byDate,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}