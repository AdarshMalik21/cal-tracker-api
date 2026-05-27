import Profile from "../models/Profile.js";
import { calculateTargets } from "../utils/calculateTargets.js";

export const getProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            profile = await Profile.create({});
        }
        res.status(200).json({ success: true, data: profile })
    }
    catch (error) {
        res.status(200).json({ success: true, data: profile })
    }
}

export const updateProfile = async (req, res) => {
    try{
        let profile = await Profile.findOne();
        if (!profile) {
            profile = await Profile.create({});
        }

        const {
      name,
      age,
      heightCm,
      currentWeightKg,
      goalWeightKg,
      gender,
      goal,
      activityLevel,
      calorieGoal,
      proteinGoalG,
      carbsGoalG,
      fatGoalG,
      autoCalculateTargets,
      waterGoalGlasses,
      workoutDaysPerWeek,
      restDays,
      activeWorkoutPlanId,
      supplementReminders,
      weeklyReviewDay,
    } = req.body;

     // apply all non-target fields first
    if (name !== undefined)               profile.name               = name
    if (age !== undefined)                profile.age                = age
    if (heightCm !== undefined)           profile.heightCm           = heightCm
    if (currentWeightKg !== undefined)    profile.currentWeightKg    = currentWeightKg
    if (goalWeightKg !== undefined)       profile.goalWeightKg       = goalWeightKg
    if (gender !== undefined)             profile.gender             = gender
    if (goal !== undefined)               profile.goal               = goal
    if (activityLevel !== undefined)      profile.activityLevel      = activityLevel
    if (autoCalculateTargets !== undefined) profile.autoCalculateTargets = autoCalculateTargets
    if (waterGoalGlasses !== undefined)   profile.waterGoalGlasses   = waterGoalGlasses
    if (workoutDaysPerWeek !== undefined) profile.workoutDaysPerWeek = workoutDaysPerWeek
    if (restDays !== undefined)           profile.restDays           = restDays
    if (activeWorkoutPlanId !== undefined) profile.activeWorkoutPlanId = activeWorkoutPlanId
    if (supplementReminders !== undefined) profile.supplementReminders = supplementReminders
    if (weeklyReviewDay !== undefined)    profile.weeklyReviewDay    = weeklyReviewDay
    // apply all non-target fields first
    if (name !== undefined)               profile.name               = name
    if (age !== undefined)                profile.age                = age
    if (heightCm !== undefined)           profile.heightCm           = heightCm
    if (currentWeightKg !== undefined)    profile.currentWeightKg    = currentWeightKg
    if (goalWeightKg !== undefined)       profile.goalWeightKg       = goalWeightKg
    if (gender !== undefined)             profile.gender             = gender
    if (goal !== undefined)               profile.goal               = goal
    if (activityLevel !== undefined)      profile.activityLevel      = activityLevel
    if (autoCalculateTargets !== undefined) profile.autoCalculateTargets = autoCalculateTargets
    if (waterGoalGlasses !== undefined)   profile.waterGoalGlasses   = waterGoalGlasses
    if (workoutDaysPerWeek !== undefined) profile.workoutDaysPerWeek = workoutDaysPerWeek
    if (restDays !== undefined)           profile.restDays           = restDays
    if (activeWorkoutPlanId !== undefined) profile.activeWorkoutPlanId = activeWorkoutPlanId
    if (supplementReminders !== undefined) profile.supplementReminders = supplementReminders
    if (weeklyReviewDay !== undefined)    profile.weeklyReviewDay    = weeklyReviewDay

    // recalculate targets if autoCalculateTargets is on
    // and any relevant field changed
    const shouldRecalculate =
      profile.autoCalculateTargets &&
      (currentWeightKg !== undefined ||
        heightCm !== undefined ||
        age !== undefined ||
        activityLevel !== undefined ||
        goal !== undefined)

    if (shouldRecalculate) {
      const targets = calculateTargets(
        profile.currentWeightKg,
        profile.heightCm,
        profile.age,
        profile.activityLevel,
        profile.goal
      )
      profile.calorieGoal  = targets.calorieGoal
      profile.proteinGoalG = targets.proteinGoalG
      profile.carbsGoalG   = targets.carbsGoalG
      profile.fatGoalG     = targets.fatGoalG
    } else {
      // manual override — only apply if autoCalculate is off
      if (!profile.autoCalculateTargets) {
        if (calorieGoal !== undefined)  profile.calorieGoal  = calorieGoal
        if (proteinGoalG !== undefined) profile.proteinGoalG = proteinGoalG
        if (carbsGoalG !== undefined)   profile.carbsGoalG   = carbsGoalG
        if (fatGoalG !== undefined)     profile.fatGoalG     = fatGoalG
      }
    }

    await profile.save();
    res.status(200).json({ success: true, data: profile })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }    
    }

 // POST /api/profile/recalculate
// manually trigger recalculation without changing any other field
export const recalculateTargets = async (req, res) => {
  try {
    const profile = await Profile.findOne()

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' })
    }

    const targets = calculateTargets(
      profile.currentWeightKg,
      profile.heightCm,
      profile.age,
      profile.activityLevel,
      profile.goal
    )

    profile.calorieGoal  = targets.calorieGoal
    profile.proteinGoalG = targets.proteinGoalG
    profile.carbsGoalG   = targets.carbsGoalG
    profile.fatGoalG     = targets.fatGoalG

    await profile.save()

    res.status(200).json({ success: true, data: profile })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}   
