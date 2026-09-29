import { Request, Response, NextFunction } from "express";
import "@backoffice/types";
import { UserRole } from "@domain/entities/enums";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.session.adminUser || req.session.adminUser.role !== UserRole.ADMIN) {
    req.session.adminUser = undefined;
    res.redirect("/admin/login");
    return;
  }
  res.locals.user = req.session.adminUser;
  next();
}
