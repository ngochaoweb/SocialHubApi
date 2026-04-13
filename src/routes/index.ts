import authRoute from "@/modules/auth/auth.route";
import healthRoute from "@/modules/health/health.route";
import { Router } from "express";

const router = Router();

router.use("/health", healthRoute);
router.use("/auth", authRoute);

export default router;
