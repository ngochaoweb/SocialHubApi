import { Request, Response } from "express";
import { healthService } from "./health.service";

export const healthController = {
  index: (req: Request, res: Response) => {
    const data = healthService.index();
    res.json(data);
  },
};
