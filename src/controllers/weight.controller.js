import WeightLog from '../models/WeightLog.js'
import Profile from '../models/Profile.js'

// GET /api/weight?limit=30
export const getWeightLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30
    const logs  = await WeightLog.find().sort({ date: -1 }).limit(limit)
    res.status(200).json({ success: true, data: logs })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/weight
export const addWeightLog = async (req, res) => {
  try {
    const { weightKg, date, notes } = req.body

    if (!weightKg || !date) {
      return res.status(400).json({ success: false, message: 'weightKg and date are required' })
    }

    // upsert — one entry per day
    const log = await WeightLog.findOneAndUpdate(
      { date },
      { weightKg, notes: notes || '' },
      { upsert: true, new: true }
    )

    // update current weight in profile
    await Profile.findOneAndUpdate({}, { currentWeightKg: weightKg })

    res.status(201).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/weight/:id
export const updateWeightLog = async (req, res) => {
  try {
    const log = await WeightLog.findById(req.params.id)
    if (!log) {
      return res.status(404).json({ success: false, message: 'Weight log not found' })
    }

    const { weightKg, notes } = req.body
    if (weightKg !== undefined) log.weightKg = weightKg
    if (notes    !== undefined) log.notes    = notes

    await log.save()
    res.status(200).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/weight/:id
export const deleteWeightLog = async (req, res) => {
  try {
    const log = await WeightLog.findByIdAndDelete(req.params.id)
    if (!log) {
      return res.status(404).json({ success: false, message: 'Weight log not found' })
    }
    res.status(200).json({ success: true, message: 'Weight log deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/weight/stats
export const getWeightStats = async (req, res) => {
  try {
    const profile = await Profile.findOne()
    const logs    = await WeightLog.find().sort({ date: 1 })

    if (logs.length === 0) {
      return res.status(200).json({ success: true, data: null })
    }

    const latest   = logs[logs.length - 1]
    const earliest = logs[0]

    const totalGain   = Math.round((latest.weightKg - earliest.weightKg) * 10) / 10
    const goalWeight  = profile ? profile.goalWeightKg : 80
    const remaining   = Math.round((goalWeight - latest.weightKg) * 10) / 10

    // avg over last 7 entries
    const last7  = logs.slice(-7)
    const avgKg  = Math.round((last7.reduce((a, l) => a + l.weightKg, 0) / last7.length) * 10) / 10

    res.status(200).json({
      success: true,
      data: {
        current:   latest.weightKg,
        goal:      goalWeight,
        remaining,
        totalGain,
        avgLast7:  avgKg,
        logs,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}