import express from "express";
import {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  activatePlan,
  getPlanDays,
  addPlanDay,
  updatePlanDay,
  deletePlanDay,
  getTodayWorkout,
  getWorkoutLog,
  getWorkoutLogById,
  createWorkoutLog,
  updateWorkoutLog,
  deleteWorkoutLog,
  getExerciseHistory,
  advancePlanDay,
  setPlanDay,
} from "../controllers/workout.controller.js";

const router = express.Router();

// today — must be before /plans/:id
router.get("/today", getTodayWorkout);
router.post("/advance-day", advancePlanDay);
router.post("/set-day", setPlanDay);

// plans
router.get("/plans", getPlans);
router.get("/plans/:id", getPlanById);
router.post("/plans", createPlan);
router.put("/plans/:id", updatePlan);
router.delete("/plans/:id", deletePlan);
router.put("/plans/:id/activate", activatePlan);

// plan days
router.get("/plans/:id/days", getPlanDays);
router.post("/plans/:id/days", addPlanDay);
router.put("/plans/:id/days/:dayId", updatePlanDay);
router.delete("/plans/:id/days/:dayId", deletePlanDay);

// workout log — specific before /:id
router.get("/log/exercise/:name/history", getExerciseHistory);
router.get("/log", getWorkoutLog);
router.get("/log/:id", getWorkoutLogById);
router.post("/log", createWorkoutLog);
router.put("/log/:id", updateWorkoutLog);
router.delete("/log/:id", deleteWorkoutLog);

export default router;
