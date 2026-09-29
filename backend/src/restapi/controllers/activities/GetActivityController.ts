import { Request, Response } from "express";
import { ActivityService } from "@domain/services/ActivityService";
export class GetActivityController {
  async handle(req: Request, res: Response) {
    res.json({
      data: await new ActivityService().findOne(Number(req.params.id)),
      success: true,
    });
  }
}
