import healthRoute from "@/modules/health/health.route";
import { Router } from "express";

const router = Router();

router.use("/health", healthRoute);

export default router;
