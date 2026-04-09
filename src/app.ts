import express from "express";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { notFoundHandler } from "./middlewares/notFoundHandler.middleware";

const app = express();

app.use(express.json());

app.use("/api/v1", router);
app.use(notFoundHandler);
app.use(errorHandler);
export default app;
