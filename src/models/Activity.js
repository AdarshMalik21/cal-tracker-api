import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['gym', 'cardio', 'daily', 'sports', 'custom'],
      default: 'custom',
    },
    MET:        { type: Number, required: true },
    isCustom:   { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Activity', activitySchema)