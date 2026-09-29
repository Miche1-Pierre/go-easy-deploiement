import dotenv from "dotenv";

dotenv.config();

const allowedEnvironments = ["development", "test", "production"];
const nodeEnv = process.env.NODE_ENV ?? "development";
if (!allowedEnvironments.includes(nodeEnv)) {
  throw new Error(`Invalid NODE_ENV: ${nodeEnv}`);
}
//contrôle limité à la production pour ne pas bloquer le dev/test avec des secrets courts
if (nodeEnv === "production" && (process.env.JWT_SECRET?.length ?? 0) < 32) {
  throw new Error("JWT_SECRET must contain at least 32 characters in production");
}
if (nodeEnv === "production" && (process.env.SESSION_SECRET?.length ?? 0) < 32) {
  throw new Error("SESSION_SECRET must contain at least 32 characters in production");
}

export const env = {
  nodeEnv,
  db: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN!,
  },
  sessionSecret: process.env.SESSION_SECRET!,
  corsOrigins: process.env.CORS_ORIGINS!.split(",").map((o) => o.trim()),
  seed: {
    adminLogin: process.env.SEED_ADMIN_LOGIN!,
    adminPassword: process.env.SEED_ADMIN_PASSWORD!,
    touristLogin: process.env.SEED_TOURIST_LOGIN!,
    touristPassword: process.env.SEED_TOURIST_PASSWORD!,
  },
};
