import mongoose from 'mongoose'

const measurementSchema = new mongoose.Schema(
  {
    weightKg:       { type: Number, default: null },
    chest:          { type: Number, default: null },   // cm
    waist:          { type: Number, default: null },
    hips:           { type: Number, default: null },
    bicepR:         { type: Number, default: null },
    bicepL:         { type: Number, default: null },
    thighR:         { type: Number, default: null },
    thighL:         { type: Number, default: null },
    shoulderWidth:  { type: Number, default: null },
    notes:          { type: String, default: '' },
    date:           { type: String, required: true },
  },
  { timestamps: true }
)

measurementSchema.index({ date: 1 })

export default mongoose.model('Measurement', measurementSchema)