import { Request, Response } from "express";
import { ActivityService } from "@domain/services/ActivityService";
export class EditActivityController {
  async handle(req: Request, res: Response) {
    res.render("admin/activity-form", {
      activity: await new ActivityService().findOne(Number(req.params.id)),
      error: null,
    });
  }
}
