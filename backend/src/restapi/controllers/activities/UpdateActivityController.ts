import { Request, Response } from "express";
import { ActivityService } from "@domain/services/ActivityService";
export class UpdateActivityController {
  async handle(req: Request, res: Response) {
    res.json({
      data: await new ActivityService().update(Number(req.params.id), req.body),
      success: true,
    });
  }
}
