import "reflect-metadata";
import bcrypt from "bcryptjs";
import { AppDataSource } from "@shared/config/data-source";
import { User } from "@domain/entities/User";
import { Activity } from "@domain/entities/Activity";
import { UserRole } from "@domain/entities/enums";
import { env } from "@config/env";

async function seed() {
  await AppDataSource.initialize();
  await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 0");
  await AppDataSource.query("DELETE FROM bookings");
  await AppDataSource.query("DELETE FROM activities");
  await AppDataSource.query("DELETE FROM users");
  await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 1");
  const users = AppDataSource.getRepository(User);
  await users.save([
    users.create({
      email: env.seed.adminLogin,
      password: await bcrypt.hash(env.seed.adminPassword, 10),
      firstName: "Jean",
      lastName: "Dupont",
      role: UserRole.ADMIN,
    }),
    users.create({
      email: env.seed.touristLogin,
      password: await bcrypt.hash(env.seed.touristPassword, 10),
      firstName: "John",
      lastName: "Doe",
      role: UserRole.TOURIST,
    }),
  ]);
  const activities = AppDataSource.getRepository(Activity);
  const inDays = (days: number, hour: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, 0, 0, 0);
    return d;
  };
  await activities.save([
    activities.create({
      title: "Nancy, ville Art nouveau",
      description:
        "Une promenade guidée à la découverte de l'École de Nancy et de ses façades emblématiques.",
      city: "Nancy",
      category: "Patrimoine",
      meetingPoint: "Place Stanislas",
      startDate: inDays(7, 10),
      durationMinutes: 120,
      pricePerPerson: 15,
      capacity: 15,
      imageUrl: "https://picsum.photos/seed/nancy-tour/900/500",
    }),
    activities.create({
      title: "Saveurs du marché lyonnais",
      description:
        "Dégustez les spécialités locales en compagnie d'un guide passionné de gastronomie.",
      city: "Lyon",
      category: "Gastronomie",
      meetingPoint: "Halles Paul Bocuse",
      startDate: inDays(12, 11),
      durationMinutes: 150,
      pricePerPerson: 39,
      capacity: 10,
      imageUrl: "https://picsum.photos/seed/lyon-food/900/500",
    }),
    activities.create({
      title: "Bordeaux à vélo",
      description:
        "Une balade accessible le long des quais et dans le centre historique.",
      city: "Bordeaux",
      category: "Plein air",
      meetingPoint: "Place des Quinconces",
      startDate: inDays(18, 9),
      durationMinutes: 180,
      pricePerPerson: 28,
      capacity: 12,
      imageUrl: "https://picsum.photos/seed/bordeaux-bike/900/500",
    }),
  ]);
  await AppDataSource.destroy();
}
seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
