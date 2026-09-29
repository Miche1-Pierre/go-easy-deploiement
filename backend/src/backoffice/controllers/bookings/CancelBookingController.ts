import { Request, Response } from "express";
import { BookingService } from "@domain/services/BookingService";
import { UserRole } from "@domain/entities/enums";
import { extractAdminError } from "@backoffice/utils";
import "@backoffice/types";

export class CancelBookingController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      await new BookingService().cancel(Number(req.params.id), {
        id: req.session.adminUser!.id,
        role: UserRole.ADMIN,
      });
      res.redirect("/admin/bookings");
    } catch (err) {
      res.redirect(`/admin/bookings?error=${encodeURIComponent(extractAdminError(err))}`);
    }
  }
}
