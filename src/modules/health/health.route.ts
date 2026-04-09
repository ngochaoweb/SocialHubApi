import { Router } from "express";
import { healthController } from "./health.controller";

const healthRoute = Router();

healthRoute.get("/", healthController.index);

export default healthRoute;
