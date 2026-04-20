import { authMiddleware } from "@/middlewares/auth.middleware";
import { Router } from "express";
import { postsController } from "./posts.controller";

const postsRoute = Router();
postsRoute.post("/", authMiddleware, postsController.create);
postsRoute.get("/", postsController.getAll);
postsRoute.get("/:id", postsController.getById);
postsRoute.patch("/:id", authMiddleware, postsController.update);
postsRoute.delete("/:id", authMiddleware, postsController.delete);

export default postsRoute;
