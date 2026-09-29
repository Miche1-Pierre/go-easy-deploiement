import { Request, Response } from "express";
import { AuthService } from "@domain/services/AuthService";

export class LoginController {
  async handle(req: Request, res: Response): Promise<void> {
    const result = await new AuthService().login(req.body);
    res.json({ data: result, success: true });
  }
}
