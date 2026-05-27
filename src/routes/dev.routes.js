import express       from 'express'
import FoodLog       from '../models/FoodLog.js'
import ActivityLog   from '../models/ActivityLog.js'
import WorkoutLog    from '../models/WorkoutLog.js'
import WeightLog     from '../models/WeightLog.js'
import Measurement   from '../models/Measurement.js'
import SupplementLog from '../models/SupplementLog.js'
import SleepLog      from '../models/SleepLog.js'
import WaterLog      from '../models/WaterLog.js'
import SorenessLog   from '../models/SorenessLog.js'
import WeeklyReview  from '../models/WeeklyReview.js'

const router = express.Router()

// POST /api/dev/reset-logs
// wipes all logs, keeps seeded data (foods, activities, workout plans, supplements, profile)
router.post('/reset-logs', async (req, res) => {
  try {
    await Promise.all([
      FoodLog.deleteMany({}),
      ActivityLog.deleteMany({}),
      WorkoutLog.deleteMany({}),
      WeightLog.deleteMany({}),
      Measurement.deleteMany({}),
      SupplementLog.deleteMany({}),
      SleepLog.deleteMany({}),
      WaterLog.deleteMany({}),
      SorenessLog.deleteMany({}),
      WeeklyReview.deleteMany({}),
    ])

    res.status(200).json({
      success: true,
      message: 'All logs cleared. Seeded data untouched.',
      cleared: [
        'foodlogs',
        'activitylogs',
        'workoutlogs',
        'weightlogs',
        'measurements',
        'supplementlogs',
        'sleeplogs',
        'waterlogs',
        'sorenessslogs',
        'weeklyreviews',
      ],
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/dev/reset-all
// wipes everything including seeded data — restart server to re-seed
router.post('/reset-all', async (req, res) => {
  try {
    const { default: Food }        = await import('../models/Food.js')
    const { default: Activity }    = await import('../models/Activity.js')
    const { default: WorkoutPlan } = await import('../models/WorkoutPlan.js')
    const { default: Supplement }  = await import('../models/Supplement.js')
    const { default: Profile }     = await import('../models/Profile.js')

    await Promise.all([
      FoodLog.deleteMany({}),
      ActivityLog.deleteMany({}),
      WorkoutLog.deleteMany({}),
      WeightLog.deleteMany({}),
      Measurement.deleteMany({}),
      SupplementLog.deleteMany({}),
      SleepLog.deleteMany({}),
      WaterLog.deleteMany({}),
      SorenessLog.deleteMany({}),
      WeeklyReview.deleteMany({}),
      Food.deleteMany({}),
      Activity.deleteMany({}),
      WorkoutPlan.deleteMany({}),
      Supplement.deleteMany({}),
      Profile.deleteMany({}),
    ])

    res.status(200).json({
      success: true,
      message: 'Everything wiped. Restart server to re-seed.',
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router