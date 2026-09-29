import { Request, Response } from "express";
import { ActivityService } from "@domain/services/ActivityService";
import { extractAdminError } from "@backoffice/utils";
export class UpdateActivityController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      await new ActivityService().update(id, {
        ...req.body,
        durationMinutes: Number(req.body.durationMinutes),
        pricePerPerson: Number(req.body.pricePerPerson),
        capacity: Number(req.body.capacity),
      });
      res.redirect("/admin/activities");
    } catch (e) {
      res.render("admin/activity-form", {
        activity: { id, ...req.body },
        error: extractAdminError(e),
      });
    }
  }
}
