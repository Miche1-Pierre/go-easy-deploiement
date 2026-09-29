import { Router } from "express";
import authRoutes from "@restapi/routes/authRoutes";
import activityRoutes from "@restapi/routes/activitiesRoutes";
import bookingRoutes from "@restapi/routes/bookingsRoutes";

const router = Router();

router.get("/health", (_req, res) =>
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    uptime: Math.floor(process.uptime()) + "s",
  }),
);
router.use("/auth", authRoutes);
router.use("/activities", activityRoutes);
router.use("/bookings", bookingRoutes);

export default router;
