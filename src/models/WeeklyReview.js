import mongoose from 'mongoose'

const weeklyReviewSchema = new mongoose.Schema(
  {
    weekLabel:    { type: String, required: true },  // "2026-W20"
    energyLevel:  { type: String, enum: ['low', 'ok', 'good', 'high'], required: true },
    gymSessions:  { type: Number, required: true },
    weightKg:     { type: Number, required: true },
    notes:        { type: String, default: '' },

    // auto-generated coach feedback stored at review time
    coachFeedback: { type: [String], default: [] },
  },
  { timestamps: true }
)

weeklyReviewSchema.index({ weekLabel: 1 })

export default mongoose.model('WeeklyReview', weeklyReviewSchema)