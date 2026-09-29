import { Request, Response } from "express";
export class NewActivityController {
  handle(_req: Request, res: Response) {
    res.render("admin/activity-form", { activity: null, error: null });
  }
}
