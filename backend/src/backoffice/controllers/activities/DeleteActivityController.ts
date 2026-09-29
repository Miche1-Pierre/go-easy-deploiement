import { Request, Response } from "express";
import { ActivityService } from "@domain/services/ActivityService";
import { extractAdminError } from "@backoffice/utils";
export class DeleteActivityController {
  async handle(req: Request, res: Response) {
    try {
      await new ActivityService().remove(Number(req.params.id));
      res.redirect("/admin/activities");
    } catch (e) {
      res.redirect(
        `/admin/activities?error=${encodeURIComponent(extractAdminError(e))}`,
      );
    }
  }
}
