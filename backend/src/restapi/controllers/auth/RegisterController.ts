import { Request, Response } from "express";
import { AuthService } from "@domain/services/AuthService";

export class RegisterController {
  async handle(req: Request, res: Response): Promise<void> {
    const result = await new AuthService().register(req.body);
    res.status(201).json({ data: result, success: true });
  }
}
