import { Request, Response } from "express";
import { ActivityService } from "@domain/services/ActivityService";
import { extractAdminError } from "@backoffice/utils";
export class ListActivitiesController {
  async handle(req: Request, res: Response) {
    try {
      res.render("admin/activities", {
        activities: await new ActivityService().findAll(),
        error: req.query.error ?? null,
      });
    } catch (e) {
      res.render("admin/activities", {
        activities: [],
        error: extractAdminError(e),
      });
    }
  }
}
