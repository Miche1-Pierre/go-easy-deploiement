import { Request, Response } from "express";
import { ActivityService } from "@domain/services/ActivityService";
export class CreateActivityController {
  async handle(req: Request, res: Response) {
    res
      .status(201)
      .json({
        data: await new ActivityService().create(req.body),
        success: true,
      });
  }
}
