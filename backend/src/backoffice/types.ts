import "express-session";
import type { PublicUser } from "@domain/services/AuthService";

declare module "express-session" {
  interface SessionData {
    adminUser?: PublicUser;
  }
}
