import mongoose from 'mongoose'

const sorenessLogSchema = new mongoose.Schema(
  {
    muscles: [
      {
        name:  { type: String, required: true },   // "chest", "back", "legs"
        level: { type: Number, min: 1, max: 5, required: true },
      },
    ],
    date: { type: String, required: true },
  },
  { timestamps: true }
)

sorenessLogSchema.index({ date: 1 })

export default mongoose.model('SorenessLog', sorenessLogSchema)