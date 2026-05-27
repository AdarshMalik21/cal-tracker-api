import WorkoutPlan from '../models/WorkoutPlan.js'
import Profile from '../models/Profile.js'

const pplPlan = {
  name:     'PPL 5 Day — Lean Bulk',
  split:    'PPL',
  isCustom: false,
  isActive: true,
  days: [
    {
      dayName:      'Push',
      dayType:      'workout',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      exercises: [
        { name: 'Bench press',          muscleGroup: 'chest',     defaultSets: 4, defaultReps: 8,  defaultWeightKg: 60 },
        { name: 'Incline dumbbell press', muscleGroup: 'chest',   defaultSets: 3, defaultReps: 10, defaultWeightKg: 20 },
        { name: 'Cable fly',            muscleGroup: 'chest',     defaultSets: 3, defaultReps: 12, defaultWeightKg: 12 },
        { name: 'Overhead press',       muscleGroup: 'shoulders', defaultSets: 4, defaultReps: 8,  defaultWeightKg: 40 },
        { name: 'Lateral raises',       muscleGroup: 'shoulders', defaultSets: 3, defaultReps: 15, defaultWeightKg: 8  },
        { name: 'Tricep pushdown',      muscleGroup: 'triceps',   defaultSets: 3, defaultReps: 12, defaultWeightKg: 25 },
        { name: 'Overhead tricep ext.', muscleGroup: 'triceps',   defaultSets: 3, defaultReps: 12, defaultWeightKg: 20 },
      ],
    },
    {
      dayName:      'Pull',
      dayType:      'workout',
      muscleGroups: ['back', 'biceps', 'rear delts'],
      exercises: [
        { name: 'Deadlift',             muscleGroup: 'back',      defaultSets: 4, defaultReps: 6,  defaultWeightKg: 80 },
        { name: 'Pull-ups',             muscleGroup: 'back',      defaultSets: 3, defaultReps: 8,  defaultWeightKg: 0  },
        { name: 'Barbell row',          muscleGroup: 'back',      defaultSets: 4, defaultReps: 8,  defaultWeightKg: 60 },
        { name: 'Lat pulldown',         muscleGroup: 'back',      defaultSets: 3, defaultReps: 10, defaultWeightKg: 50 },
        { name: 'Face pulls',           muscleGroup: 'rear delts',defaultSets: 3, defaultReps: 15, defaultWeightKg: 15 },
        { name: 'Barbell curl',         muscleGroup: 'biceps',    defaultSets: 3, defaultReps: 10, defaultWeightKg: 30 },
        { name: 'Hammer curl',          muscleGroup: 'biceps',    defaultSets: 3, defaultReps: 12, defaultWeightKg: 12 },
      ],
    },
    {
      dayName:      'Legs',
      dayType:      'workout',
      muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves'],
      exercises: [
        { name: 'Squat',                muscleGroup: 'quads',      defaultSets: 4, defaultReps: 8,  defaultWeightKg: 80 },
        { name: 'Romanian deadlift',    muscleGroup: 'hamstrings', defaultSets: 3, defaultReps: 10, defaultWeightKg: 60 },
        { name: 'Leg press',            muscleGroup: 'quads',      defaultSets: 3, defaultReps: 12, defaultWeightKg: 120},
        { name: 'Leg curl',             muscleGroup: 'hamstrings', defaultSets: 3, defaultReps: 12, defaultWeightKg: 40 },
        { name: 'Bulgarian split squat',muscleGroup: 'glutes',     defaultSets: 3, defaultReps: 10, defaultWeightKg: 20 },
        { name: 'Calf raises',          muscleGroup: 'calves',     defaultSets: 4, defaultReps: 15, defaultWeightKg: 40 },
      ],
    },
    {
      dayName:  'Rest',
      dayType:  'rest',
      muscleGroups: [],
      exercises: [],
    },
    {
      dayName:      'Push',
      dayType:      'workout',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      exercises: [
        { name: 'Bench press',          muscleGroup: 'chest',     defaultSets: 4, defaultReps: 8,  defaultWeightKg: 60 },
        { name: 'Incline dumbbell press', muscleGroup: 'chest',   defaultSets: 3, defaultReps: 10, defaultWeightKg: 20 },
        { name: 'Cable fly',            muscleGroup: 'chest',     defaultSets: 3, defaultReps: 12, defaultWeightKg: 12 },
        { name: 'Overhead press',       muscleGroup: 'shoulders', defaultSets: 4, defaultReps: 8,  defaultWeightKg: 40 },
        { name: 'Lateral raises',       muscleGroup: 'shoulders', defaultSets: 3, defaultReps: 15, defaultWeightKg: 8  },
        { name: 'Tricep pushdown',      muscleGroup: 'triceps',   defaultSets: 3, defaultReps: 12, defaultWeightKg: 25 },
        { name: 'Overhead tricep ext.', muscleGroup: 'triceps',   defaultSets: 3, defaultReps: 12, defaultWeightKg: 20 },
      ],
    },
    {
      dayName:      'Pull',
      dayType:      'workout',
      muscleGroups: ['back', 'biceps', 'rear delts'],
      exercises: [
        { name: 'Deadlift',             muscleGroup: 'back',      defaultSets: 4, defaultReps: 6,  defaultWeightKg: 80 },
        { name: 'Pull-ups',             muscleGroup: 'back',      defaultSets: 3, defaultReps: 8,  defaultWeightKg: 0  },
        { name: 'Barbell row',          muscleGroup: 'back',      defaultSets: 4, defaultReps: 8,  defaultWeightKg: 60 },
        { name: 'Lat pulldown',         muscleGroup: 'back',      defaultSets: 3, defaultReps: 10, defaultWeightKg: 50 },
        { name: 'Face pulls',           muscleGroup: 'rear delts',defaultSets: 3, defaultReps: 15, defaultWeightKg: 15 },
        { name: 'Barbell curl',         muscleGroup: 'biceps',    defaultSets: 3, defaultReps: 10, defaultWeightKg: 30 },
        { name: 'Hammer curl',          muscleGroup: 'biceps',    defaultSets: 3, defaultReps: 12, defaultWeightKg: 12 },
      ],
    },
    {
      dayName:  'Rest',
      dayType:  'rest',
      muscleGroups: [],
      exercises: [],
    },
  ],
}

export const seedWorkoutPlans = async () => {
  try {
    const existing = await WorkoutPlan.countDocuments({ isCustom: false })
    if (existing > 0) {
      console.log(`Workout plans already seeded (${existing} found), skipping`)
      return
    }

    const plan = await WorkoutPlan.create(pplPlan)

    // set as active plan in profile
    await Profile.findOneAndUpdate({}, { activeWorkoutPlanId: plan._id })

    console.log('PPL workout plan seeded successfully')
  } catch (err) {
    console.error('Workout plan seed failed:', err.message)
  }
}