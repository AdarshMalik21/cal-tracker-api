import SleepLog    from '../models/SleepLog.js'
import WaterLog    from '../models/WaterLog.js'
import SorenessLog from '../models/SorenessLog.js'
import Profile     from '../models/Profile.js'

// ─── SLEEP ───────────────────────────────────────────

// GET /api/recovery/sleep?date=2026-05-17
export const getSleepLog = async (req, res) => {
  try {
    const { date } = req.query
    if (!date) return res.status(400).json({ success: false, message: 'date is required' })

    const log = await SleepLog.findOne({ date })
    res.status(200).json({ success: true, data: log || null })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/recovery/sleep
export const logSleep = async (req, res) => {
  try {
    const { hoursSlept, quality, notes, date } = req.body
    if (!hoursSlept || !quality || !date) {
      return res.status(400).json({ success: false, message: 'hoursSlept, quality, date are required' })
    }

    const log = await SleepLog.findOneAndUpdate(
      { date },
      { hoursSlept, quality, notes: notes || '' },
      { upsert: true, new: true }
    )

    res.status(201).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/recovery/sleep/:id
export const updateSleepLog = async (req, res) => {
  try {
    const log = await SleepLog.findById(req.params.id)
    if (!log) return res.status(404).json({ success: false, message: 'Sleep log not found' })

    const { hoursSlept, quality, notes } = req.body
    if (hoursSlept !== undefined) log.hoursSlept = hoursSlept
    if (quality    !== undefined) log.quality    = quality
    if (notes      !== undefined) log.notes      = notes

    await log.save()
    res.status(200).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ─── WATER ───────────────────────────────────────────

// GET /api/recovery/water?date=2026-05-17
export const getWaterLog = async (req, res) => {
  try {
    const { date } = req.query
    if (!date) return res.status(400).json({ success: false, message: 'date is required' })

    const profile = await Profile.findOne()
    const log     = await WaterLog.findOne({ date })

    res.status(200).json({
      success: true,
      data: {
        glasses:  log ? log.glasses : 0,
        goal:     profile ? profile.waterGoalGlasses : 10,
        logId:    log ? log._id : null,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/recovery/water
export const logWater = async (req, res) => {
  try {
    const { glasses, date } = req.body
    if (glasses === undefined || !date) {
      return res.status(400).json({ success: false, message: 'glasses and date are required' })
    }

    const log = await WaterLog.findOneAndUpdate(
      { date },
      { glasses },
      { upsert: true, new: true }
    )

    res.status(201).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/recovery/water/:id
export const updateWaterLog = async (req, res) => {
  try {
    const log = await WaterLog.findById(req.params.id)
    if (!log) return res.status(404).json({ success: false, message: 'Water log not found' })

    if (req.body.glasses !== undefined) log.glasses = req.body.glasses
    await log.save()

    res.status(200).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ─── SORENESS ────────────────────────────────────────

// GET /api/recovery/soreness?date=2026-05-17
export const getSorenessLog = async (req, res) => {
  try {
    const { date } = req.query
    if (!date) return res.status(400).json({ success: false, message: 'date is required' })

    const log = await SorenessLog.findOne({ date })
    res.status(200).json({ success: true, data: log || null })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/recovery/soreness
export const logSoreness = async (req, res) => {
  try {
    const { muscles, date } = req.body
    if (!muscles || !date) {
      return res.status(400).json({ success: false, message: 'muscles and date are required' })
    }

    const log = await SorenessLog.findOneAndUpdate(
      { date },
      { muscles },
      { upsert: true, new: true }
    )

    res.status(201).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/recovery/soreness/:id
export const updateSorenessLog = async (req, res) => {
  try {
    const log = await SorenessLog.findById(req.params.id)
    if (!log) return res.status(404).json({ success: false, message: 'Soreness log not found' })

    if (req.body.muscles !== undefined) log.muscles = req.body.muscles
    await log.save()

    res.status(200).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/recovery?date=2026-05-17
// all recovery data for a day in one call
export const getRecoveryByDate = async (req, res) => {
  try {
    const { date } = req.query
    if (!date) return res.status(400).json({ success: false, message: 'date is required' })

    const [sleep, water, soreness, profile] = await Promise.all([
      SleepLog.findOne({ date }),
      WaterLog.findOne({ date }),
      SorenessLog.findOne({ date }),
      Profile.findOne(),
    ])

    res.status(200).json({
      success: true,
      date,
      data: {
        sleep:    sleep    || null,
        water:    { glasses: water ? water.glasses : 0, goal: profile ? profile.waterGoalGlasses : 10 },
        soreness: soreness || null,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}