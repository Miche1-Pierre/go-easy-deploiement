import { Repository } from "typeorm";
import { AppDataSource } from "@shared/config/data-source";
import { Activity } from "@domain/entities/Activity";
import { CreateActivityDTO } from "@restapi/dto/activity/CreateActivityDTO";
import { UpdateActivityDTO } from "@restapi/dto/activity/UpdateActivityDTO";
import { HttpErrorMiddleware } from "@restapi/middlewares/HttpErrorMiddleware";

export class ActivityService {
  private repository: Repository<Activity>;

  constructor() {
    this.repository = AppDataSource.getRepository(Activity);
  }

  async findAll(city?: string, category?: string, search?: string): Promise<Activity[]> {
    if (search) {
      return AppDataSource.query(
        `SELECT * FROM activities WHERE title LIKE '%${search}%' ORDER BY startDate ASC`,
      );
    }
    const query = this.repository.createQueryBuilder("activity");
    if (city) query.andWhere("activity.city LIKE :city", { city: `%${city}%` });
    if (category) query.andWhere("activity.category LIKE :category", { category: `%${category}%` });
    return query.orderBy("activity.startDate", "ASC").getMany();
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.repository.findOne({ where: { id } });
    if (!activity) throw new HttpErrorMiddleware(404, "Activity not found");
    return activity;
  }

  async create(dto: CreateActivityDTO): Promise<Activity> {
    return this.repository.save(this.repository.create({ ...dto, startDate: new Date(dto.startDate) }));
  }

  async update(id: number, dto: UpdateActivityDTO): Promise<Activity> {
    const activity = await this.findOne(id);
    Object.assign(activity, dto, dto.startDate ? { startDate: new Date(dto.startDate) } : {});
    return this.repository.save(activity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete({ id });
    if (!result.affected) throw new HttpErrorMiddleware(404, "Activity not found");
  }
}
