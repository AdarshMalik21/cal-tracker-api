import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // Personal info
    name: { type: String, default: "Adarsh" },
    age: { type: Number, default: 24 },
    heightCm: { type: Number, default: 180 },
    currentWeightKg: { type: Number, default: 70 },
    goalWeightKg: { type: Number, default: 80 },
    gender: { type: String, enum: ["male", "female"], default: "male" },

    // Fitness goal
    goal: {
      type: String,
      enum: ["lose_fat", "lean_bulk", "maintain"],
      default: "lean_bulk",
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
      default: "active",
    },
    // sedentary = desk job no gym
    // light     = light exercise 1-3x/week
    // moderate  = gym 3-4x/week
    // active    = gym 4-5x/week (yours)
    // very_active = gym 6x + physical job

    // Calorie & macro targets (manually set or auto-calculated from TDEE)
    calorieGoal: { type: Number, default: 3000 },
    proteinGoalG: { type: Number, default: 170 },
    carbsGoalG: { type: Number, default: 330 },
    fatGoalG: { type: Number, default: 75 },

    // Auto-calculate toggle
    // if true → recalculate targets whenever weight/activity changes
    autoCalculateTargets: { type: Boolean, default: true },

    // Water
    waterGoalGlasses: { type: Number, default: 10 },

    // Workout schedule
    workoutDaysPerWeek: { type: Number, default: 5 },
    restDays: { type: [String], default: ["thursday", "sunday"] },
    // used to show rest/gym label on home screen day strip

    // Sequential workout tracking
    currentPlanDayIndex: { type: Number, default: 0 },

    // Workout plan reference
    activeWorkoutPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
      default: null,
    },

    // Supplement reminders on/off
    supplementReminders: { type: Boolean, default: true },

    // Weekly check-in day
    weeklyReviewDay: { type: String, default: "sunday" },
  },
  { timestamps: true },
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
