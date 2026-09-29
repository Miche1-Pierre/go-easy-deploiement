import { Request, Response } from "express";
import { BookingService } from "@domain/services/BookingService";

export class ListAllBookingsController {
  async handle(_req: Request, res: Response): Promise<void> {
    const result = await new BookingService().findAll();
    res.json({ data: result, success: true });
  }
}
