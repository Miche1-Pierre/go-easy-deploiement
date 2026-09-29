import { Request, Response } from "express";
import { BookingService } from "@domain/services/BookingService";

export class ListMyBookingsController {
  async handle(req: Request, res: Response): Promise<void> {
    const result = await new BookingService().findForUser(req.user!.sub);
    res.json({ data: result, success: true });
  }
}
