import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema(
  {
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      default: null,
    },

    // snapshot so edits to activity don't affect past logs
    activitySnapshot: {
      name:     { type: String, required: true },
      category: { type: String, required: true },
      MET:      { type: Number, required: true },
    },

    durationMinutes: { type: Number, required: true },
    caloriesBurned:  { type: Number, required: true },  // auto-calculated
    weightKgAtTime:  { type: Number, required: true },  // pulled from profile at log time

    date:     { type: String, required: true },         // "2026-05-17"
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

activityLogSchema.index({ date: 1 })

export default mongoose.model('ActivityLog', activityLogSchema)