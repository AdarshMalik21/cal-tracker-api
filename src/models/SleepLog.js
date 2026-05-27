import mongoose from 'mongoose'

const sleepLogSchema = new mongoose.Schema(
  {
    hoursSlept: { type: Number, required: true },
    quality:    { type: Number, min: 1, max: 5, required: true },  // 1-5
    notes:      { type: String, default: '' },
    date:       { type: String, required: true },
  },
  { timestamps: true }
)

sleepLogSchema.index({ date: 1 })

export default mongoose.model('SleepLog', sleepLogSchema)