import { Request, Response } from "express";
import { BookingService } from "@domain/services/BookingService";

export class CancelBookingController {
  async handle(req: Request, res: Response): Promise<void> {
    const booking = await new BookingService().cancel(Number(req.params.id), {
      id: req.user!.sub,
      role: req.user!.role,
    });
    res.json({ data: booking, success: true });
  }
}
