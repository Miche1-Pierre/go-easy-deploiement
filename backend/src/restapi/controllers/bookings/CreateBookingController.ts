import { Request, Response } from "express";
import { BookingService } from "@domain/services/BookingService";

export class CreateBookingController {
  async handle(req: Request, res: Response): Promise<void> {
    const booking = await new BookingService().create(req.user!.sub, req.body);
    res.status(201).json({ data: booking, success: true });
  }
}
