import { Request, Response } from "express";
import "@backoffice/types";

export class ShowLoginController {
  handle(req: Request, res: Response): void {
    if (req.session.adminUser) {
      res.redirect("/admin/activities");
      return;
    }
    res.render("admin/login", { error: null });
  }
}
