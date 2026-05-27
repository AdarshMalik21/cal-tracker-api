import Measurement from '../models/Measurement.js'

// GET /api/measurements?limit=12
export const getMeasurements = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12
    const measurements = await Measurement.find().sort({ date: -1 }).limit(limit)
    res.status(200).json({ success: true, data: measurements })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/measurements/latest
export const getLatestMeasurement = async (req, res) => {
  try {
    const latest   = await Measurement.findOne().sort({ date: -1 })
    const previous = await Measurement.findOne().sort({ date: -1 }).skip(1)

    if (!latest) {
      return res.status(200).json({ success: true, data: null })
    }

    // calculate diff from previous
    let diff = null
    if (previous) {
      diff = {}
      const fields = ['weightKg', 'chest', 'waist', 'hips', 'bicepR', 'bicepL', 'thighR', 'thighL', 'shoulderWidth']
      fields.forEach(f => {
        if (latest[f] !== null && previous[f] !== null) {
          diff[f] = Math.round((latest[f] - previous[f]) * 10) / 10
        }
      })
    }

    res.status(200).json({ success: true, data: { latest, previous, diff } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/measurements
export const addMeasurement = async (req, res) => {
  try {
    const { weightKg, chest, waist, hips, bicepR, bicepL, thighR, thighL, shoulderWidth, notes, date } = req.body

    if (!date) {
      return res.status(400).json({ success: false, message: 'date is required' })
    }

    // upsert — one entry per day
    const measurement = await Measurement.findOneAndUpdate(
      { date },
      { weightKg, chest, waist, hips, bicepR, bicepL, thighR, thighL, shoulderWidth, notes: notes || '' },
      { upsert: true, new: true }
    )

    res.status(201).json({ success: true, data: measurement })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/measurements/:id
export const updateMeasurement = async (req, res) => {
  try {
    const m = await Measurement.findById(req.params.id)
    if (!m) {
      return res.status(404).json({ success: false, message: 'Measurement not found' })
    }

    const fields = ['weightKg', 'chest', 'waist', 'hips', 'bicepR', 'bicepL', 'thighR', 'thighL', 'shoulderWidth', 'notes']
    fields.forEach(f => { if (req.body[f] !== undefined) m[f] = req.body[f] })

    await m.save()
    res.status(200).json({ success: true, data: m })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/measurements/:id
export const deleteMeasurement = async (req, res) => {
  try {
    const m = await Measurement.findByIdAndDelete(req.params.id)
    if (!m) {
      return res.status(404).json({ success: false, message: 'Measurement not found' })
    }
    res.status(200).json({ success: true, message: 'Measurement deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}