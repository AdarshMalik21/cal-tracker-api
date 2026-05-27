import mongoose from 'mongoose'

const foodLogSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      default: null,       // null if food was deleted later
    },

    // snapshot at time of logging — so edits to food don't affect past logs
    foodSnapshot: {
      name:    { type: String, required: true },
      unit:    { type: String, required: true },
      kcal:    { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs:   { type: Number, required: true },
      fat:     { type: Number, required: true },
    },

    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'pre_workout', 'post_workout', 'snacks'],
      required: true,
    },

    servings: { type: Number, required: true, default: 1 },

    // calculated at log time = snapshot values × servings
    totalKcal:    { type: Number, required: true },
    totalProtein: { type: Number, required: true },
    totalCarbs:   { type: Number, required: true },
    totalFat:     { type: Number, required: true },

    date: { type: String, required: true },   // "2026-05-17"
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// index for fast daily queries
foodLogSchema.index({ date: 1 })

export default mongoose.model('FoodLog', foodLogSchema)