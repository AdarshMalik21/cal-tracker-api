import mongoose from 'mongoose'

const waterLogSchema = new mongoose.Schema(
  {
    glasses:  { type: Number, required: true },
    date:     { type: String, required: true },
  },
  { timestamps: true }
)

waterLogSchema.index({ date: 1 })

export default mongoose.model('WaterLog', waterLogSchema)