import Supplement from '../models/Supplement.js'
import SupplementLog from '../models/SupplementLog.js'

// GET /api/supplements
export const getSupplements = async (req, res) => {
  try {
    const supplements = await Supplement.find({ isArchived: false })
    res.status(200).json({ success: true, data: supplements })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/supplements
export const createSupplement = async (req, res) => {
  try {
    const { name, dose, timing } = req.body
    if (!name || !dose || !timing) {
      return res.status(400).json({ success: false, message: 'name, dose, timing are required' })
    }

    const supplement = await Supplement.create({ name, dose, timing, isCustom: true })
    res.status(201).json({ success: true, data: supplement })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/supplements/:id
export const updateSupplement = async (req, res) => {
  try {
    const s = await Supplement.findById(req.params.id)
    if (!s || s.isArchived) {
      return res.status(404).json({ success: false, message: 'Supplement not found' })
    }

    const { name, dose, timing } = req.body
    if (name   !== undefined) s.name   = name
    if (dose   !== undefined) s.dose   = dose
    if (timing !== undefined) s.timing = timing

    await s.save()
    res.status(200).json({ success: true, data: s })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/supplements/:id
export const deleteSupplement = async (req, res) => {
  try {
    const s = await Supplement.findById(req.params.id)
    if (!s || s.isArchived) {
      return res.status(404).json({ success: false, message: 'Supplement not found' })
    }

    s.isArchived = true
    await s.save()
    res.status(200).json({ success: true, message: 'Supplement deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/supplements/log?date=2026-05-17
export const getSupplementLog = async (req, res) => {
  try {
    const { date } = req.query
    if (!date) {
      return res.status(400).json({ success: false, message: 'date is required' })
    }

    // get all active supplements
    const supplements = await Supplement.find({ isArchived: false })

    // get today's logs
    const logs = await SupplementLog.find({ date })

    // merge — mark each supplement as taken or not
    const result = supplements.map(s => {
      const log = logs.find(l => l.supplementId.toString() === s._id.toString())
      return {
        supplement: s,
        logId:  log ? log._id  : null,
        taken:  log ? log.taken : false,
      }
    })

    res.status(200).json({ success: true, date, data: result })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/supplements/log
export const logSupplement = async (req, res) => {
  try {
    const { supplementId, date, taken } = req.body
    if (!supplementId || !date) {
      return res.status(400).json({ success: false, message: 'supplementId and date are required' })
    }

    const supplement = await Supplement.findById(supplementId)
    if (!supplement || supplement.isArchived) {
      return res.status(404).json({ success: false, message: 'Supplement not found' })
    }

    // upsert — one log per supplement per day
    const log = await SupplementLog.findOneAndUpdate(
      { supplementId, date },
      {
        supplementSnapshot: {
          name:   supplement.name,
          dose:   supplement.dose,
          timing: supplement.timing,
        },
        taken: taken !== undefined ? taken : true,
      },
      { upsert: true, new: true }
    )

    res.status(201).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/supplements/log/:id
export const updateSupplementLog = async (req, res) => {
  try {
    const log = await SupplementLog.findById(req.params.id)
    if (!log) {
      return res.status(404).json({ success: false, message: 'Supplement log not found' })
    }

    if (req.body.taken !== undefined) log.taken = req.body.taken
    await log.save()

    res.status(200).json({ success: true, data: log })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}