import { Request, Response } from "express";
import { AuthService } from "@domain/services/AuthService";

export class MeController {
  async handle(req: Request, res: Response): Promise<void> {
    const user = await new AuthService().me(req.user!.sub);
    res.json({ data: user, success: true });
  }
}
