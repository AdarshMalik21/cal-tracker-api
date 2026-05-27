import WorkoutPlan from "../models/WorkoutPlan.js";
import WorkoutLog from "../models/WorkoutLog.js";
import Profile from "../models/Profile.js";

// ─── PLANS ───────────────────────────────────────────

// GET /api/workout/plans
export const getPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ isArchived: false }).select(
      "-days.exercises",
    );
    res.status(200).json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/workout/plans/:id
export const getPlanById = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan || plan.isArchived) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }
    res.status(200).json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/workout/plans
export const createPlan = async (req, res) => {
  try {
    const { name, split, days } = req.body;

    if (!name || !split) {
      return res
        .status(400)
        .json({ success: false, message: "name and split are required" });
    }

    const plan = await WorkoutPlan.create({
      name,
      split,
      days: days || [],
      isCustom: true,
    });

    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/workout/plans/:id
export const updatePlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan || plan.isArchived) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    const { name, split, days } = req.body;

    if (name !== undefined) plan.name = name;
    if (split !== undefined) plan.split = split;
    if (days !== undefined) plan.days = days;

    await plan.save();

    res.status(200).json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/workout/plans/:id
export const deletePlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan || plan.isArchived) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    plan.isArchived = true;
    await plan.save();

    res.status(200).json({ success: true, message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/workout/plans/:id/activate
export const activatePlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan || plan.isArchived) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    // deactivate all others
    await WorkoutPlan.updateMany({}, { isActive: false });
    plan.isActive = true;
    await plan.save();

    // update profile
    await Profile.findOneAndUpdate({}, { activeWorkoutPlanId: plan._id });

    res.status(200).json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PLAN DAYS ───────────────────────────────────────

// GET /api/workout/plans/:id/days
export const getPlanDays = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan || plan.isArchived) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    res.status(200).json({ success: true, data: plan.days });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/workout/plans/:id/days
export const addPlanDay = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan || plan.isArchived) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    const { dayName, dayType, muscleGroups, exercises } = req.body;

    if (!dayName) {
      return res
        .status(400)
        .json({ success: false, message: "dayName is required" });
    }

    plan.days.push({ dayName, dayType, muscleGroups, exercises });
    await plan.save();

    res.status(201).json({ success: true, data: plan.days });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/workout/plans/:id/days/:dayId
export const updatePlanDay = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan || plan.isArchived) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    const day = plan.days.id(req.params.dayId);
    if (!day) {
      return res.status(404).json({ success: false, message: "Day not found" });
    }

    const { dayName, dayType, muscleGroups, exercises } = req.body;

    if (dayName !== undefined) day.dayName = dayName;
    if (dayType !== undefined) day.dayType = dayType;
    if (muscleGroups !== undefined) day.muscleGroups = muscleGroups;
    if (exercises !== undefined) day.exercises = exercises;

    await plan.save();

    res.status(200).json({ success: true, data: day });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/workout/plans/:id/days/:dayId
export const deletePlanDay = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan || plan.isArchived) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    plan.days = plan.days.filter((d) => d._id.toString() !== req.params.dayId);
    await plan.save();

    res.status(200).json({ success: true, message: "Day deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/workout/today
// returns today's plan day based on active plan + sequential index
export const getTodayWorkout = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile || !profile.activeWorkoutPlanId) {
      return res
        .status(404)
        .json({ success: false, message: "No active workout plan set" });
    }

    const plan = await WorkoutPlan.findById(profile.activeWorkoutPlanId);
    if (!plan || plan.isArchived) {
      return res
        .status(404)
        .json({ success: false, message: "Active plan not found" });
    }

    if (!plan.days.length) {
      return res
        .status(404)
        .json({ success: false, message: "Active plan has no days" });
    }

    const currentPlanDayIndex = Number.isInteger(profile.currentPlanDayIndex)
      ? profile.currentPlanDayIndex
      : 0;
    const planDayIndex = currentPlanDayIndex % plan.days.length;
    const todayDay = plan.days[planDayIndex];

    res.status(200).json({
      success: true,
      data: {
        plan: {
          _id: plan._id,
          name: plan.name,
          split: plan.split,
          days: plan.days,
        },
        today: todayDay,
        currentPlanDayIndex,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/workout/advance-day
export const advancePlanDay = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const current = Number.isInteger(profile.currentPlanDayIndex)
      ? profile.currentPlanDayIndex
      : 0;

    profile.currentPlanDayIndex = current + 1;
    await profile.save();

    res.status(200).json({
      success: true,
      data: { currentPlanDayIndex: profile.currentPlanDayIndex },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/workout/set-day
export const setPlanDay = async (req, res) => {
  try {
    const { dayIndex } = req.body;

    if (!Number.isInteger(dayIndex) || dayIndex < 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "dayIndex must be a non-negative integer",
        });
    }

    const profile = await Profile.findOne();
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    profile.currentPlanDayIndex = dayIndex;
    await profile.save();

    res.status(200).json({
      success: true,
      data: { currentPlanDayIndex: profile.currentPlanDayIndex },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── WORKOUT LOG ─────────────────────────────────────

// GET /api/workout/log?date=2026-05-17
export const getWorkoutLog = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "date is required" });
    }

    const logs = await WorkoutLog.find({ date }).sort({ loggedAt: 1 });

    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/workout/log/:id
export const getWorkoutLogById = async (req, res) => {
  try {
    const log = await WorkoutLog.findById(req.params.id);
    if (!log) {
      return res
        .status(404)
        .json({ success: false, message: "Workout log not found" });
    }

    res.status(200).json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/workout/log
export const createWorkoutLog = async (req, res) => {
  try {
    const {
      planId,
      planDayId,
      workoutName,
      muscleGroups,
      exercises,
      durationMinutes,
      notes,
      date,
    } = req.body;

    if (!workoutName || !date) {
      return res
        .status(400)
        .json({ success: false, message: "workoutName and date are required" });
    }

    const log = await WorkoutLog.create({
      planId: planId || null,
      planDayId: planDayId || null,
      workoutName,
      muscleGroups: muscleGroups || [],
      exercises: exercises || [],
      durationMinutes: durationMinutes || 0,
      notes: notes || "",
      date,
    });

    res.status(201).json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/workout/log/:id
export const updateWorkoutLog = async (req, res) => {
  try {
    const log = await WorkoutLog.findById(req.params.id);
    if (!log) {
      return res
        .status(404)
        .json({ success: false, message: "Workout log not found" });
    }

    const { workoutName, muscleGroups, exercises, durationMinutes, notes } =
      req.body;

    if (workoutName !== undefined) log.workoutName = workoutName;
    if (muscleGroups !== undefined) log.muscleGroups = muscleGroups;
    if (exercises !== undefined) log.exercises = exercises;
    if (durationMinutes !== undefined) log.durationMinutes = durationMinutes;
    if (notes !== undefined) log.notes = notes;

    await log.save();

    res.status(200).json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/workout/log/:id
export const deleteWorkoutLog = async (req, res) => {
  try {
    const log = await WorkoutLog.findByIdAndDelete(req.params.id);
    if (!log) {
      return res
        .status(404)
        .json({ success: false, message: "Workout log not found" });
    }

    res.status(200).json({ success: true, message: "Workout log deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/workout/log/exercise/:name/history
// returns last 10 sessions for progressive overload display
export const getExerciseHistory = async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);

    const logs = await WorkoutLog.find(
      { "exercises.name": { $regex: name, $options: "i" } },
      { date: 1, "exercises.$": 1 },
    )
      .sort({ date: -1 })
      .limit(10);

    // extract just the matched exercise sets per session
    const history = logs.map((log) => ({
      date: log.date,
      exercise: log.exercises[0],
    }));

    // best set across all history (for PR tracking)
    let prWeightKg = 0;
    history.forEach((h) => {
      h.exercise.sets.forEach((s) => {
        if (s.weightKg > prWeightKg) prWeightKg = s.weightKg;
      });
    });

    res.status(200).json({
      success: true,
      exercise: name,
      pr: prWeightKg,
      history,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
