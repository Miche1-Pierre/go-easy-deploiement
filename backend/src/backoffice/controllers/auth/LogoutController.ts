import { Request, Response } from "express";
import "@backoffice/types";

export class LogoutController {
  handle(req: Request, res: Response): void {
    req.session.destroy(() => res.redirect("/admin/login"));
  }
}
