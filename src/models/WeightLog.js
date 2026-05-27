import mongoose from 'mongoose'

const weightLogSchema = new mongoose.Schema(
  {
    weightKg: { type: Number, required: true },
    date:     { type: String, required: true },   // "2026-05-17"
    notes:    { type: String, default: '' },
  },
  { timestamps: true }
)

weightLogSchema.index({ date: 1 })

export default mongoose.model('WeightLog', weightLogSchema)