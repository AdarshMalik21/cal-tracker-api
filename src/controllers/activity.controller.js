import Activity from '../models/Activity.js'

// GET /api/activities
export const getActivities = async (req, res) => {
  try {
    const { category, search } = req.query
    const query = { isArchived: false }

    if (category) query.category = category
    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const activities = await Activity.find(query).sort({ category: 1, name: 1 })

    res.status(200).json({ success: true, data: activities })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/activities/:id
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity || activity.isArchived) {
      return res.status(404).json({ success: false, message: 'Activity not found' })
    }
    res.status(200).json({ success: true, data: activity })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/activities
export const createActivity = async (req, res) => {
  try {
    const { name, category, MET } = req.body

    if (!name || !MET) {
      return res.status(400).json({ success: false, message: 'name and MET are required' })
    }

    const activity = await Activity.create({
      name,
      category: category || 'custom',
      MET,
      isCustom: true,
    })

    res.status(201).json({ success: true, data: activity })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/activities/:id
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity || activity.isArchived) {
      return res.status(404).json({ success: false, message: 'Activity not found' })
    }

    const { name, category, MET } = req.body

    if (name     !== undefined) activity.name     = name
    if (category !== undefined) activity.category = category
    if (MET      !== undefined) activity.MET      = MET

    await activity.save()

    res.status(200).json({ success: true, data: activity })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/activities/:id
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity || activity.isArchived) {
      return res.status(404).json({ success: false, message: 'Activity not found' })
    }

    activity.isArchived = true
    await activity.save()

    res.status(200).json({ success: true, message: 'Activity deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}