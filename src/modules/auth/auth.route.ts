import { Router } from "express";
import { authController } from "./auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const authRoute = Router();

authRoute.post("/register", authController.register);
authRoute.post("/login", authController.login);
authRoute.get("/me", authMiddleware, authController.me);
authRoute.post("/refresh", authController.refresh);

export default authRoute;
