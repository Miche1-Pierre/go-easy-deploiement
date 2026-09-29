import { Repository } from "typeorm";
import { AppDataSource } from "@shared/config/data-source";
import { Booking } from "@domain/entities/Booking";
import { BookingStatus, UserRole } from "@domain/entities/enums";
import { CreateBookingDTO } from "@restapi/dto/booking/CreateBookingDTO";
import { HttpErrorMiddleware } from "@restapi/middlewares/HttpErrorMiddleware";
import { Activity } from "@domain/entities/Activity";

export class BookingService {
  private repository: Repository<Booking>;

  constructor() {
    this.repository = AppDataSource.getRepository(Booking);
  }

  async create(userId: number, dto: CreateBookingDTO): Promise<Booking> {
    return AppDataSource.transaction(async (manager) => {
      const activity = await manager.findOne(Activity, {
        where: { id: dto.activityId },
        lock: { mode: "pessimistic_write" },
      });
      if (!activity) throw new HttpErrorMiddleware(404, "Activity not found");
      if (new Date(activity.startDate).getTime() <= Date.now()) {
        throw new HttpErrorMiddleware(422, "This activity has already started");
      }

      const raw = await manager.createQueryBuilder(Booking, "b")
        .select("COALESCE(SUM(b.participants), 0)", "booked")
        .where("b.activityId = :activityId", { activityId: dto.activityId })
        .andWhere("b.status = :status", { status: BookingStatus.CONFIRMED })
        .setLock("pessimistic_write")
        .getRawOne<{ booked: string }>();

      if (Number(raw?.booked ?? 0) + dto.participants > activity.capacity) {
        throw new HttpErrorMiddleware(409, "Not enough places available");
      }

      return manager.save(manager.create(Booking, {
        userId,
        activityId: dto.activityId,
        participants: dto.participants,
        totalPrice: Number(activity.pricePerPerson) * dto.participants,
        status: BookingStatus.CONFIRMED,
      }));
    });
  }

  findForUser(userId: number): Promise<Booking[]> {
    return this.repository.find({ where: { userId }, relations: { activity: true }, order: { createdAt: "DESC" } });
  }

  findAll(): Promise<Booking[]> {
    return this.repository.find({ relations: { activity: true, user: true }, order: { createdAt: "DESC" } });
  }

  async cancel(id: number, requester: { id: number; role: UserRole }): Promise<Booking> {
    const booking = await this.repository.findOne({ where: { id } });
    if (!booking) throw new HttpErrorMiddleware(404, "Booking not found");
    if (requester.role !== UserRole.ADMIN && booking.userId !== requester.id) {
      throw new HttpErrorMiddleware(403, "Forbidden");
    }
    booking.status = BookingStatus.CANCELLED;
    return this.repository.save(booking);
  }
}
