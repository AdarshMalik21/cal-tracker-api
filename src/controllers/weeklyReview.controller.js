import WeeklyReview  from '../models/WeeklyReview.js'
import Profile       from '../models/Profile.js'
import FoodLog       from '../models/FoodLog.js'
import ActivityLog   from '../models/ActivityLog.js'
import WorkoutLog    from '../models/WorkoutLog.js'
import { getWeekLabel, getWeekRange } from '../utils/getWeekLabel.js'
import { generateCoachFeedback }      from '../utils/generateCoachFeedback.js'

// GET /api/weekly-review?week=2026-W20
export const getWeeklyReview = async (req, res) => {
  try {
    const weekLabel = req.query.week || getWeekLabel()
    const review    = await WeeklyReview.findOne({ weekLabel })
    res.status(200).json({ success: true, data: review || null })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/weekly-review/latest
export const getLatestWeeklyReview = async (req, res) => {
  try {
    const review = await WeeklyReview.findOne().sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: review || null })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/weekly-review
export const createWeeklyReview = async (req, res) => {
  try {
    const { energyLevel, gymSessions, weightKg, notes } = req.body

    if (!energyLevel || gymSessions === undefined || !weightKg) {
      return res.status(400).json({
        success: false,
        message: 'energyLevel, gymSessions, weightKg are required',
      })
    }

    const weekLabel      = getWeekLabel()
    const { start, end } = getWeekRange(weekLabel)
    const profile        = await Profile.findOne()

    // calculate week averages for coach feedback
    const [foodLogs, activityLogs] = await Promise.all([
      FoodLog.find({ date: { $gte: start, $lte: end } }),
      ActivityLog.find({ date: { $gte: start, $lte: end } }),
    ])

    // group by date for net calories
    const byDate = {}
    foodLogs.forEach(l => {
      if (!byDate[l.date]) byDate[l.date] = { kcal: 0, protein: 0 }
      byDate[l.date].kcal    += l.totalKcal
      byDate[l.date].protein += l.totalProtein
    })

    const actByDate = {}
    activityLogs.forEach(l => {
      if (!actByDate[l.date]) actByDate[l.date] = 0
      actByDate[l.date] += l.caloriesBurned
    })

    const days       = Object.keys(byDate)
    const avgNetKcal = days.length
      ? Math.round(days.reduce((a, d) => a + (byDate[d].kcal - (actByDate[d] || 0)), 0) / days.length)
      : 0
    const avgProtein = days.length
      ? Math.round(days.reduce((a, d) => a + byDate[d].protein, 0) / days.length)
      : 0

    const coachFeedback = generateCoachFeedback({
      avgNetKcal,
      calorieGoal:    profile ? profile.calorieGoal    : 3000,
      avgProtein,
      proteinGoal:    profile ? profile.proteinGoalG   : 170,
      gymSessions,
      targetSessions: profile ? profile.workoutDaysPerWeek : 5,
      energyLevel,
    })

    // upsert — one review per week
    const review = await WeeklyReview.findOneAndUpdate(
      { weekLabel },
      { energyLevel, gymSessions, weightKg, notes: notes || '', coachFeedback },
      { upsert: true, new: true }
    )

    // update profile weight
    await Profile.findOneAndUpdate({}, { currentWeightKg: weightKg })

    res.status(201).json({ success: true, data: review })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/weekly-review/history?limit=10
export const getWeeklyReviewHistory = async (req, res) => {
  try {
    const limit   = parseInt(req.query.limit) || 10
    const reviews = await WeeklyReview.find().sort({ createdAt: -1 }).limit(limit)
    res.status(200).json({ success: true, data: reviews })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}