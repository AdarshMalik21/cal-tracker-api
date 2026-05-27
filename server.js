import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import errorHandler from "./src/middleware/errorHandler.js";
import profileRoutes from "./src/routes/profile.routes.js";
import foodRoutes from "./src/routes/food.routes.js";
import { seedFoods } from "./src/seed/food.seed.js";
import foodLogRoutes from "./src/routes/foodLog.routes.js";
import activityRoutes from "./src/routes/activity.routes.js";
import activityLogRoutes from "./src/routes/activityLog.routes.js";
import { seedActivities } from "./src/seed/activities.seed.js";
import workoutRoutes from "./src/routes/workout.routes.js";
import { seedWorkoutPlans } from "./src/seed/workoutPlans.seed.js";
import { seedSupplements } from "./src/seed/supplements.seed.js";
import weightRoutes from "./src/routes/weight.routes.js";
import measurementRoutes from "./src/routes/measurement.routes.js";
import supplementRoutes from "./src/routes/supplement.routes.js";
import recoveryRoutes from "./src/routes/recovery.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import weeklyReviewRoutes from "./src/routes/weeklyReview.routes.js";
import devRoutes from "./src/routes/dev.routes.js";

dotenv.config();
const startServer = async () => {
  await connectDB();
  await seedFoods(); // runs once, skips if already seeded
  await seedActivities(); // runs once, skips if already seeded
  await seedWorkoutPlans();
  await seedSupplements();
  // runs once, skips if already seeded

  const app = express();

  app.use(cors());
  app.use(express.json());

  // health check — for keep-alive pings
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/profile", profileRoutes);
  app.use("/api/foods", foodRoutes);
  app.use("/api/food-log", foodLogRoutes);
  app.use("/api/activities", activityRoutes);
  app.use("/api/activity-log", activityLogRoutes);
  app.use("/api/workout", workoutRoutes);
  app.use("/api/weight", weightRoutes);
  app.use("/api/measurements", measurementRoutes);
  app.use("/api/supplements", supplementRoutes);
  app.use("/api/recovery", recoveryRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/weekly-review", weeklyReviewRoutes);
  app.use("/api/dev", devRoutes);

  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
