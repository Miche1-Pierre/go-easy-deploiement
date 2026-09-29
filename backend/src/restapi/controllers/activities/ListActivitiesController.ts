import { Request, Response } from "express";
import { ActivityService } from "@domain/services/ActivityService";
export class ListActivitiesController {
  async handle(req: Request, res: Response) {
    const city =
      typeof req.query.city === "string" ? req.query.city : undefined;
    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    res.json({
      data: await new ActivityService().findAll(city, category, search),
      success: true,
    });
  }
}
