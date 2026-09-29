import { Repository } from "typeorm";
import { AppDataSource } from "@shared/config/data-source";
import { Booking } from "@domain/entities/Booking";
import { BookingStatus, UserRole } from "@domain/entities/enums";
import { CreateBookingDTO } from "@restapi/dto/booking/CreateBookingDTO";
import { HttpErrorMiddleware } from "@restapi/middlewares/HttpErrorMiddleware";
import { ActivityService } from "./ActivityService";

export class BookingService {
  private repository: Repository<Booking>;

  constructor() {
    this.repository = AppDataSource.getRepository(Booking);
  }

  async create(userId: number, dto: CreateBookingDTO): Promise<Booking> {
    const activity = await new ActivityService().findOne(dto.activityId);
    const raw = await this.repository.createQueryBuilder("b")
      .select("COALESCE(SUM(b.participants), 0)", "booked")
      .where("b.activityId = :activityId", { activityId: dto.activityId })
      .andWhere("b.status = :status", { status: BookingStatus.CONFIRMED })
      .getRawOne<{ booked: string }>();
    if (Number(raw?.booked ?? 0) + dto.participants > activity.capacity) {
      throw new HttpErrorMiddleware(409, "Not enough places available");
    }
    return this.repository.save(this.repository.create({
      userId, activityId: dto.activityId, participants: dto.participants,
      totalPrice: dto.totalPrice ?? Number(activity.pricePerPerson) * dto.participants,
      status: BookingStatus.CONFIRMED,
    }));
  }

  findForUser(userId: number): Promise<Booking[]> {
    return this.repository.find({ where: { userId }, relations: { activity: true }, order: { createdAt: "DESC" } });
  }

  findAll(): Promise<Booking[]> {
    return this.repository.find({ relations: { activity: true, user: true }, order: { createdAt: "DESC" } });
  }

  async cancel(id: number, _requester: { id: number; role: UserRole }): Promise<Booking> {
    const booking = await this.repository.findOne({ where: { id } });
    if (!booking) throw new HttpErrorMiddleware(404, "Booking not found");
    booking.status = BookingStatus.CANCELLED;
    return this.repository.save(booking);
  }
}
