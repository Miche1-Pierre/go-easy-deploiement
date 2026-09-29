import { Request, Response } from "express";
import { BookingService } from "@domain/services/BookingService";

export class ListMyBookingsController {
  async handle(req: Request, res: Response): Promise<void> {
    const userId = typeof req.query.userId === "string" ? Number(req.query.userId) : req.user!.sub;
    const result = await new BookingService().findForUser(userId);
    res.json({ data: result, success: true });
  }
}
