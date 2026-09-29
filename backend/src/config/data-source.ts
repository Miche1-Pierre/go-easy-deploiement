import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "@domain/entities/User";
import { Activity } from "@domain/entities/Activity";
import { Booking } from "@domain/entities/Booking";

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  //TypeORM ne doit jamais modifier le schéma automatiquement : toute évolution
  //passe par une migration versionnée, y compris en développement
  synchronize: false,
  logging: false,
  entities: [User, Activity, Booking],
  migrations: [
    env.nodeEnv === "production"
      ? "dist/migrations/*.js"
      : "src/migrations/*.ts",
  ],
  migrationsTableName: "migrations",
});
