import authRoute from "@/modules/auth/auth.route";
import healthRoute from "@/modules/health/health.route";
import postsRoute from "@/modules/posts/posts.route";
import usersRoute from "@/modules/users/users.route";
import { Router } from "express";

const router = Router();

router.use("/health", healthRoute);
router.use("/auth", authRoute);
router.use("/users", usersRoute);
router.use("/posts", postsRoute);

export default router;
