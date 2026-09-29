import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@shared/config/env";
import { UserRole } from "@domain/entities/enums";
import { User } from "@domain/entities/User";
import { AppDataSource } from "@shared/config/data-source";
import { HttpErrorMiddleware } from "./HttpErrorMiddleware";

export interface AuthPayload {
  sub: number;
  role: UserRole;
  ver: number;
}

declare global {
  namespace Express { interface Request { user?: AuthPayload; } }
}

export function authnMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new HttpErrorMiddleware(401, "Missing or malformed Authorization header");
  }

  let payload: AuthPayload;
  try {
    //restreint l'algorithme accepté pour éviter une attaque par confusion d'algorithme
    payload = jwt.verify(header.slice(7), env.jwt.secret, {
      algorithms: ["HS256"],
    }) as unknown as AuthPayload;
  } catch {
    throw new HttpErrorMiddleware(401, "Invalid or expired token");
  }

  //vérifie en base que le token n'a pas été révoqué (tokenVersion) et que le rôle
  //dans le token reflète toujours le rôle actuel (sinon le JWT est purement stateless)
  AppDataSource.getRepository(User).findOne({ where: { id: payload.sub } })
    .then((user) => {
      if (!user || user.tokenVersion !== payload.ver || user.role !== payload.role) {
        next(new HttpErrorMiddleware(401, "Revoked or stale token"));
        return;
      }
      req.user = payload;
      next();
    })
    .catch(next);
}

export function authzMiddleware(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new HttpErrorMiddleware(401, "Not authenticated");
    if (!roles.includes(req.user.role)) throw new HttpErrorMiddleware(403, "Insufficient permissions");
    next();
  };
}
