import mongoose from 'mongoose'

const supplementSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    dose:       { type: String, required: true },     // "5g", "1 scoop", "1 tablet"
    timing:     { type: String, required: true },     // "post-workout", "with breakfast"
    isCustom:   { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Supplement', supplementSchema)