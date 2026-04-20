import { authMiddleware } from "@/middlewares/auth.middleware";
import { Router } from "express";
import { usersController } from "./users.controller";

const usersRoute = Router();

usersRoute.get("/me", authMiddleware, usersController.getMe);
usersRoute.patch("/me", authMiddleware, usersController.updateMe);
usersRoute.patch("/me/password", authMiddleware, usersController.changePassword);
usersRoute.get("/:id", usersController.getById);

export default usersRoute;
