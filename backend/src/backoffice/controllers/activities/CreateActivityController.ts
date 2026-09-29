import { Request, Response } from "express";
import { ActivityService } from "@domain/services/ActivityService";
import { extractAdminError } from "@backoffice/utils";
export class CreateActivityController {
  async handle(req: Request, res: Response) {
    try {
      await new ActivityService().create({
        ...req.body,
        durationMinutes: Number(req.body.durationMinutes),
        pricePerPerson: Number(req.body.pricePerPerson),
        capacity: Number(req.body.capacity),
      });
      res.redirect("/admin/activities");
    } catch (e) {
      res.render("admin/activity-form", {
        activity: req.body,
        error: extractAdminError(e),
      });
    }
  }
}
