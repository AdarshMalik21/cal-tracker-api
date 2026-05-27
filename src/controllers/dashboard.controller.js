import Profile from "../models/Profile.js";
import FoodLog from "../models/FoodLog.js";
import ActivityLog from "../models/ActivityLog.js";
import WorkoutLog from "../models/WorkoutLog.js";
import WorkoutPlan from "../models/WorkoutPlan.js";
import WeightLog from "../models/WeightLog.js";
import WaterLog from "../models/WaterLog.js";
import SleepLog from "../models/SleepLog.js";
import SorenessLog from "../models/SorenessLog.js";
import SupplementLog from "../models/SupplementLog.js";
import Supplement from "../models/Supplement.js";
import { getWeekLabel, getWeekRange } from "../utils/getWeekLabel.js";

// GET /api/dashboard?date=2026-05-17
export const getDashboard = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];
    const weekLabel = getWeekLabel(new Date(date));
    const { start, end } = getWeekRange(weekLabel);

    // ── fetch everything in parallel ──────────────────
    const [
      profile,
      foodLogs,
      activityLogs,
      workoutLog,
      waterLog,
      sleepLog,
      sorenessLog,
      supplements,
      supplementLogs,
      weightLog,
      weekFoodLogs,
      weekActivityLogs,
      weekWorkoutLogs,
    ] = await Promise.all([
      Profile.findOne(),
      FoodLog.find({ date }),
      ActivityLog.find({ date }),
      WorkoutLog.findOne({ date }),
      WaterLog.findOne({ date }),
      SleepLog.findOne({ date }),
      SorenessLog.findOne({ date }),
      Supplement.find({ isArchived: false }),
      SupplementLog.find({ date }),
      WeightLog.findOne({ date }),
      FoodLog.find({ date: { $gte: start, $lte: end } }),
      ActivityLog.find({ date: { $gte: start, $lte: end } }),
      WorkoutLog.find({ date: { $gte: start, $lte: end } }),
    ]);

    // ── today: calories ───────────────────────────────
    const caloriesEaten = Math.round(
      foodLogs.reduce((a, l) => a + l.totalKcal, 0),
    );
    const caloriesBurned = Math.round(
      activityLogs.reduce((a, l) => a + l.caloriesBurned, 0),
    );
    const netCalories = caloriesEaten - caloriesBurned;
    const calorieGoal = profile ? profile.calorieGoal : 3000;
    const surplus = netCalories - calorieGoal;

    // ── today: macros ─────────────────────────────────
    const macros = foodLogs.reduce(
      (acc, l) => {
        acc.protein += l.totalProtein;
        acc.carbs += l.totalCarbs;
        acc.fat += l.totalFat;
        return acc;
      },
      { protein: 0, carbs: 0, fat: 0 },
    );
    macros.protein = Math.round(macros.protein);
    macros.carbs = Math.round(macros.carbs);
    macros.fat = Math.round(macros.fat);

    // ── today: water ──────────────────────────────────
    const waterGlasses = waterLog ? waterLog.glasses : 0;
    const waterGoal = profile ? profile.waterGoalGlasses : 10;

    // ── today: supplements ────────────────────────────
    const supplementStatus = supplements.map((s) => {
      const log = supplementLogs.find(
        (l) => l.supplementId.toString() === s._id.toString(),
      );
      return {
        supplementId: s._id,
        name: s.name,
        dose: s.dose,
        timing: s.timing,
        taken: log ? log.taken : false,
      };
    });
    const supplementsDone = supplementStatus.filter((s) => s.taken).length;

    // ── today: workout ────────────────────────────────
    let todaysPlan = null;
    if (profile && profile.activeWorkoutPlanId) {
      const plan = await WorkoutPlan.findById(profile.activeWorkoutPlanId);
      if (plan) {
        const dayMap = [6, 0, 1, 2, 3, 4, 5];
        const dayIndex = new Date(date).getDay();
        const planIndex = dayMap[dayIndex] % plan.days.length;
        todaysPlan = plan.days[planIndex];
      }
    }

    // ── today: soreness warnings ──────────────────────
    const sorenessWarnings = [];
    if (sorenessLog) {
      sorenessLog.muscles.forEach((m) => {
        if (m.level >= 4) {
          sorenessWarnings.push(
            `${m.name} is very sore (${m.level}/5) — skip training it today`,
          );
        }
      });
    }

    // ── today: coach insights ─────────────────────────
    const coachInsights = [];

    if (surplus < -300) {
      coachInsights.push(
        `You are ${Math.abs(surplus)} kcal below your bulk target. Add a meal before bed — curd + peanut butter is an easy 300 kcal.`,
      );
    } else if (surplus >= -300 && surplus <= 600) {
      coachInsights.push(
        `Net calories on track. ${netCalories} kcal net vs ${calorieGoal} goal.`,
      );
    } else {
      coachInsights.push(
        `${surplus} kcal above goal today. Fine occasionally but watch it.`,
      );
    }

    if (macros.protein < (profile ? profile.proteinGoalG * 0.7 : 120)) {
      coachInsights.push(
        `Protein is low at ${macros.protein}g. Add a whey shake or 2 eggs to close the gap.`,
      );
    }

    if (waterGlasses < waterGoal * 0.5 && new Date().getHours() > 14) {
      coachInsights.push(
        `Only ${waterGlasses} glasses of water so far. Aim for ${waterGoal} today.`,
      );
    }

    if (sleepLog && sleepLog.hoursSlept < 7) {
      coachInsights.push(
        `Only ${sleepLog.hoursSlept} hours sleep last night. Recovery and muscle growth will be impacted.`,
      );
    }

    sorenessWarnings.forEach((w) => coachInsights.push(w));

    // ── weekly stats ──────────────────────────────────
    // group food logs by date
    const weekDates = {};
    weekFoodLogs.forEach((l) => {
      if (!weekDates[l.date]) weekDates[l.date] = { kcal: 0, protein: 0 };
      weekDates[l.date].kcal += l.totalKcal;
      weekDates[l.date].protein += l.totalProtein;
    });

    // group activity logs by date for net calc
    const weekActivityByDate = {};
    weekActivityLogs.forEach((l) => {
      if (!weekActivityByDate[l.date]) weekActivityByDate[l.date] = 0;
      weekActivityByDate[l.date] += l.caloriesBurned;
    });

    const weekDayKeys = Object.keys(weekDates);
    const avgNetKcal = weekDayKeys.length
      ? Math.round(
          weekDayKeys.reduce(
            (a, d) => a + (weekDates[d].kcal - (weekActivityByDate[d] || 0)),
            0,
          ) / weekDayKeys.length,
        )
      : 0;
    const avgProtein = weekDayKeys.length
      ? Math.round(
          weekDayKeys.reduce((a, d) => a + weekDates[d].protein, 0) /
            weekDayKeys.length,
        )
      : 0;
    const avgBurned = weekActivityLogs.length
      ? Math.round(
          weekActivityLogs.reduce((a, l) => a + l.caloriesBurned, 0) /
            (weekDayKeys.length || 1),
        )
      : 0;
    const gymSessions = weekWorkoutLogs.length;

    // streak — count consecutive days with food logs going back from today
    let streak = 0;
    const checkDate = new Date(date);
    while (true) {
      const d = checkDate.toISOString().split("T")[0];
      const logs = await FoodLog.countDocuments({ date: d });
      if (logs === 0) break;
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // ── assemble response ─────────────────────────────
    res.status(200).json({
      success: true,
      date,
      profile,
      today: {
        caloriesEaten,
        caloriesBurned,
        netCalories,
        calorieGoal,
        surplus,
        macros,
        macroGoals: {
          protein: profile ? profile.proteinGoalG : 170,
          carbs: profile ? profile.carbsGoalG : 330,
          fat: profile ? profile.fatGoalG : 75,
        },
        water: { glasses: waterGlasses, goal: waterGoal },
        sleep: sleepLog,
        soreness: sorenessLog,
        supplements: supplementStatus,
        supplementsDone,
        supplementsTotal: supplements.length,
        workoutDone: !!workoutLog,
        workoutLog: workoutLog || null,
        todaysPlan,
        weightLogged: weightLog ? weightLog.weightKg : null,
        coachInsights,
      },
      weeklyStats: {
        weekLabel,
        start,
        end,
        avgNetKcal,
        avgProtein,
        avgBurned,
        gymSessions,
        targetSessions: profile ? profile.workoutDaysPerWeek : 5,
        streak,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
