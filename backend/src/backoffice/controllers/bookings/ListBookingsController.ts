import { Request, Response } from "express";
import { BookingService } from "@domain/services/BookingService";
import { extractAdminError } from "@backoffice/utils";

export class ListBookingsController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await new BookingService().findAll();
      res.render("admin/bookings", {
        bookings,
        error: req.query.error ?? null,
      });
    } catch (err) {
      res.render("admin/bookings", {
        bookings: [],
        error: extractAdminError(err),
      });
    }
  }
}
