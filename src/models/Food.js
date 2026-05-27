import mongoose from 'mongoose'

const foodSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    unit:      { type: String, required: true },        // "bowl", "piece", "100g", "scoop"
    kcal:      { type: Number, required: true },
    protein:   { type: Number, required: true },        // grams
    carbs:     { type: Number, required: true },        // grams
    fat:       { type: Number, required: true },        // grams

    tag: {
      type: String,
      enum: ['protein', 'carbs', 'dairy', 'fruits', 'vegetables', 'fats', 'supplements', 'custom'],
      default: 'custom',
    },

    category: {
      type: String,
      enum: ['indian', 'general', 'custom'],
      default: 'indian',
    },

    aliases:    { type: [String], default: [] },        // ["dal", "daal"] for search
    isCustom:   { type: Boolean, default: false },      // false = seeded, true = user added
    isArchived: { type: Boolean, default: false },      // soft delete

    // saved meal combo — null for regular foods
    isSavedMeal: { type: Boolean, default: false },
    savedMealItems: [
      {
        foodId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
        foodName: { type: String },
        servings: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
)

// text index for search
foodSchema.index({ name: 'text', aliases: 'text' })

export default mongoose.model('Food', foodSchema)