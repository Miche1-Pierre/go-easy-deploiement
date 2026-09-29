import { Request, Response } from "express";
import { AuthService } from "@domain/services/AuthService";

export class LogoutController {
  async handle(req: Request, res: Response): Promise<void> {
    await new AuthService().revokeTokens(req.user!.sub);
    res.status(204).send();
  }
}
