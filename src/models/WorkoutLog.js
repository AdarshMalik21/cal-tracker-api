import mongoose from 'mongoose'

const setSchema = new mongoose.Schema({
  setNumber:  { type: Number, required: true },
  weightKg:   { type: Number, default: 0 },
  reps:       { type: Number, required: true },
  completed:  { type: Boolean, default: false },
  isPersonalRecord: { type: Boolean, default: false },
})

const exerciseLogSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  muscleGroup: { type: String, default: '' },
  sets:        { type: [setSchema], default: [] },
  notes:       { type: String, default: '' },
})

const workoutLogSchema = new mongoose.Schema(
  {
    planId:    { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan', default: null },
    planDayId: { type: mongoose.Schema.Types.ObjectId, default: null },

    // snapshot of plan day name at time of logging
    workoutName:  { type: String, required: true },   // "Push day"
    muscleGroups: { type: [String], default: [] },

    exercises: { type: [exerciseLogSchema], default: [] },

    durationMinutes: { type: Number, default: 0 },
    notes:           { type: String, default: '' },

    date:     { type: String, required: true },       // "2026-05-17"
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

workoutLogSchema.index({ date: 1 })
workoutLogSchema.index({ 'exercises.name': 1 })

export default mongoose.model('WorkoutLog', workoutLogSchema)