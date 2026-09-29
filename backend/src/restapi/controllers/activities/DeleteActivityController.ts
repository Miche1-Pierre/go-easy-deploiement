import { Request, Response } from "express";
import { ActivityService } from "@domain/services/ActivityService";
export class DeleteActivityController {
  async handle(req: Request, res: Response) {
    await new ActivityService().remove(Number(req.params.id));
    res.status(204).send();
  }
}
