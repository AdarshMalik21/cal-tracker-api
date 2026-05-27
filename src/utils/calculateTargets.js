export function calculateTargets(weightKg, heightCm, age, activityLevel, goal) {
  const multipliers = {
    sedentary:   1.2,
    light:       1.375,
    moderate:    1.55,
    active:      1.725,
    very_active: 1.9,
  }

  const surplus = {
    lose_fat:   -400,
    lean_bulk:  +400,
    maintain:   0,
  }

  const BMR = Math.round(88.36 + 13.4 * weightKg + 4.8 * heightCm - 5.7 * age)
  const TDEE = Math.round(BMR * (multipliers[activityLevel] || 1.725))
  const calorieGoal = TDEE + (surplus[goal] || 400)

  const proteinGoalG = Math.round(weightKg * 2.4)
  const fatGoalG     = Math.round((calorieGoal * 0.25) / 9)
  const carbsGoalG   = Math.round((calorieGoal - proteinGoalG * 4 - fatGoalG * 9) / 4)

  return { calorieGoal, proteinGoalG, carbsGoalG, fatGoalG }
}