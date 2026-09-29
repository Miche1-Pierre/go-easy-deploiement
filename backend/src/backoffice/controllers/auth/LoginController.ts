import { Request, Response } from "express";
import { AuthService } from "@domain/services/AuthService";
import { extractAdminError } from "@backoffice/utils";
import "@backoffice/types";
import { UserRole } from "@shared/domain/entities/enums";

export class LoginController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { user } = await new AuthService().login(req.body);
      if (user.role !== UserRole.ADMIN)
        throw new Error("Accès réservé aux administrateurs.");
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => (err ? reject(err) : resolve()));
      });
      req.session.adminUser = user;
      res.redirect("/admin/activities");
    } catch (err) {
      res.render("admin/login", { error: extractAdminError(err) });
    }
  }
}
