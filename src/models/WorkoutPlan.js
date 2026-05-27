import mongoose from 'mongoose'

const exerciseSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  muscleGroup:      { type: String, required: true },
  defaultSets:      { type: Number, default: 3 },
  defaultReps:      { type: Number, default: 10 },
  defaultWeightKg:  { type: Number, default: 0 },
  notes:            { type: String, default: '' },
})

const planDaySchema = new mongoose.Schema({
  dayName:      { type: String, required: true },   // "Push", "Pull", "Legs", "Rest"
  dayType:      { type: String, enum: ['workout', 'rest'], default: 'workout' },
  muscleGroups: { type: [String], default: [] },    // ["chest", "shoulders", "triceps"]
  exercises:    { type: [exerciseSchema], default: [] },
})

const workoutPlanSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },   // "PPL 5 Day"
    split:      { type: String, required: true },   // "PPL", "Upper/Lower", "Full Body"
    days:       { type: [planDaySchema], default: [] },
    isCustom:   { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isActive:   { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('WorkoutPlan', workoutPlanSchema)