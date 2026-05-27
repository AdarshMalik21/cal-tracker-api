import Food from '../models/Food.js'

// GET /api/foods
export const getFoods = async (req, res) => {
  try {
    const { search, tag, category, isCustom, page = 1, limit = 20 } = req.query

    const query = { isArchived: false, isSavedMeal: false }

    if (tag)      query.tag      = tag
    if (category) query.category = category
    if (isCustom !== undefined) query.isCustom = isCustom === 'true'

    if (search) {
      query.$or = [
        { name:    { $regex: search, $options: 'i' } },
        { aliases: { $regex: search, $options: 'i' } },
      ]
    }

    const skip  = (parseInt(page) - 1) * parseInt(limit)
    const total = await Food.countDocuments(query)
    const foods = await Food.find(query).skip(skip).limit(parseInt(limit)).sort({ name: 1 })

    res.status(200).json({
      success: true,
      total,
      page:  parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data:  foods,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/foods/:id
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
    if (!food || food.isArchived) {
      return res.status(404).json({ success: false, message: 'Food not found' })
    }
    res.status(200).json({ success: true, data: food })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/foods
export const createFood = async (req, res) => {
  try {
    const { name, unit, kcal, protein, carbs, fat, tag, aliases } = req.body

    if (!name || !unit || kcal === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      return res.status(400).json({ success: false, message: 'name, unit, kcal, protein, carbs, fat are required' })
    }

    const food = await Food.create({
      name, unit, kcal, protein, carbs, fat,
      tag:      tag || 'custom',
      aliases:  aliases || [],
      isCustom: true,
      category: 'custom',
    })

    res.status(201).json({ success: true, data: food })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/foods/:id
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
    if (!food || food.isArchived) {
      return res.status(404).json({ success: false, message: 'Food not found' })
    }

    const { name, unit, kcal, protein, carbs, fat, tag, aliases } = req.body

    if (name    !== undefined) food.name    = name
    if (unit    !== undefined) food.unit    = unit
    if (kcal    !== undefined) food.kcal    = kcal
    if (protein !== undefined) food.protein = protein
    if (carbs   !== undefined) food.carbs   = carbs
    if (fat     !== undefined) food.fat     = fat
    if (tag     !== undefined) food.tag     = tag
    if (aliases !== undefined) food.aliases = aliases

    await food.save()

    res.status(200).json({ success: true, data: food })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/foods/:id  (soft delete)
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
    if (!food || food.isArchived) {
      return res.status(404).json({ success: false, message: 'Food not found' })
    }

    food.isArchived = true
    await food.save()

    res.status(200).json({ success: true, message: 'Food deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/foods/saved-meals
export const getSavedMeals = async (req, res) => {
  try {
    const meals = await Food.find({ isSavedMeal: true, isArchived: false })
    res.status(200).json({ success: true, data: meals })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/foods/saved-meals
export const createSavedMeal = async (req, res) => {
  try {
    const { name, items } = req.body
    // items = [{ foodId, foodName, servings }]

    if (!name || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'name and items are required' })
    }

    // calculate totals from items
    let totalKcal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0

    for (const item of items) {
      const food = await Food.findById(item.foodId)
      if (food) {
        totalKcal    += food.kcal    * item.servings
        totalProtein += food.protein * item.servings
        totalCarbs   += food.carbs   * item.servings
        totalFat     += food.fat     * item.servings
      }
    }

    const meal = await Food.create({
      name,
      unit:           'meal',
      kcal:           Math.round(totalKcal),
      protein:        Math.round(totalProtein),
      carbs:          Math.round(totalCarbs),
      fat:            Math.round(totalFat),
      tag:            'custom',
      category:       'custom',
      isCustom:       true,
      isSavedMeal:    true,
      savedMealItems: items,
    })

    res.status(201).json({ success: true, data: meal })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/foods/saved-meals/:id
export const updateSavedMeal = async (req, res) => {
  try {
    const meal = await Food.findOne({ _id: req.params.id, isSavedMeal: true })
    if (!meal || meal.isArchived) {
      return res.status(404).json({ success: false, message: 'Saved meal not found' })
    }

    const { name, items } = req.body
    if (name) meal.name = name

    if (items && items.length > 0) {
      let totalKcal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0

      for (const item of items) {
        const food = await Food.findById(item.foodId)
        if (food) {
          totalKcal    += food.kcal    * item.servings
          totalProtein += food.protein * item.servings
          totalCarbs   += food.carbs   * item.servings
          totalFat     += food.fat     * item.servings
        }
      }

      meal.savedMealItems = items
      meal.kcal           = Math.round(totalKcal)
      meal.protein        = Math.round(totalProtein)
      meal.carbs          = Math.round(totalCarbs)
      meal.fat            = Math.round(totalFat)
    }

    await meal.save()
    res.status(200).json({ success: true, data: meal })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/foods/saved-meals/:id
export const deleteSavedMeal = async (req, res) => {
  try {
    const meal = await Food.findOne({ _id: req.params.id, isSavedMeal: true })
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Saved meal not found' })
    }

    meal.isArchived = true
    await meal.save()

    res.status(200).json({ success: true, message: 'Saved meal deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}