import ActivityLog from '../models/ActivityLog.js'
import Activity from '../models/Activity.js'
import Profile from '../models/Profile.js'

// GET /api/activity-log?date=2026-05-17
export const getActivityLog = async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ success: false, message: 'date is required' })
    }

    const logs = await ActivityLog.find({ date }).sort({ loggedAt: 1 })

    const totalBurned = logs.reduce((acc, log) => acc + log.caloriesBurned, 0)
    const totalMinutes = logs.reduce((acc, log) => acc + log.durationMinutes, 0)

    res.status(200).json({
      success: true,
      date,
      totalBurned:  Math.round(totalBurned),
      totalMinutes,
      data: logs,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/activity-log
export const addActivityLog = async (req, res) => {
  try {
    const { activityId, durationMinutes, date } = req.body

    if (!activityId || !durationMinutes || !date) {
      return res.status(400).json({
        success: false,
        message: 'activityId, durationMinutes, date are required',
      })
    }

    const activity = await Activity.findById(activityId)
    if (!activity || activity.isArchived) {
      return res.status(404).json({ success: false, message: 'Activity not found' })
    }

    // get current weight from profile for accurate calculation
    const profile = await Profile.findOne()
    const weightKg = profile ? profile.currentWeightKg : 70

    // MET × weight(kg) × duration(hrs)
    const caloriesBurned = Math.round(activity.MET * weightKg * (durationMinutes / 60))

    const log = await ActivityLog.create({
      activityId,
      activitySnapshot: {
        name:     activity.name,
        category: activity.category,
        MET:      activity.MET,
      },
      durationMinutes,
      caloriesBurned,
      weightKgAtTime: weightKg,
      date,
    })

    res.status(201).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/activity-log/:id
export const updateActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id)
    if (!log) {
      return res.status(404).json({ success: false, message: 'Log entry not found' })
    }

    const { durationMinutes } = req.body

    if (durationMinutes !== undefined) {
      log.durationMinutes = durationMinutes
      // recalculate with original MET and weight at time of logging
      log.caloriesBurned = Math.round(
        log.activitySnapshot.MET * log.weightKgAtTime * (durationMinutes / 60)
      )
    }

    await log.save()

    res.status(200).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/activity-log/:id
export const deleteActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findByIdAndDelete(req.params.id)
    if (!log) {
      return res.status(404).json({ success: false, message: 'Log entry not found' })
    }

    res.status(200).json({ success: true, message: 'Activity log deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/activity-log/range?start=2026-05-11&end=2026-05-17
export const getActivityLogRange = async (req, res) => {
  try {
    const { start, end } = req.query

    if (!start || !end) {
      return res.status(400).json({ success: false, message: 'start and end dates are required' })
    }

    const logs = await ActivityLog.find({
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 })

    // group by date
    const byDate = {}
    logs.forEach(log => {
      if (!byDate[log.date]) {
        byDate[log.date] = { caloriesBurned: 0, totalMinutes: 0, activities: [] }
      }
      byDate[log.date].caloriesBurned += log.caloriesBurned
      byDate[log.date].totalMinutes   += log.durationMinutes
      byDate[log.date].activities.push(log.activitySnapshot.name)
    })

    // round calories
    Object.keys(byDate).forEach(d => {
      byDate[d].caloriesBurned = Math.round(byDate[d].caloriesBurned)
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