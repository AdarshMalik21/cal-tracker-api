import mongoose from 'mongoose'

const supplementLogSchema = new mongoose.Schema(
  {
    supplementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplement',
      required: true,
    },
    supplementSnapshot: {
      name:   { type: String, required: true },
      dose:   { type: String, required: true },
      timing: { type: String, required: true },
    },
    taken:    { type: Boolean, default: false },
    date:     { type: String, required: true },
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

supplementLogSchema.index({ date: 1 })

export default mongoose.model('SupplementLog', supplementLogSchema)