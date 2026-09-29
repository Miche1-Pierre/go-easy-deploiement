import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "@shared/config/env";
import { UserRole } from "@domain/entities/enums";
import { HttpErrorMiddleware } from "@restapi/middlewares/HttpErrorMiddleware";
import { authnMiddleware, authzMiddleware } from "@restapi/middlewares/authMiddleware";
import { AppDataSource } from "@shared/config/data-source";

function signToken(payload: { sub: number; role: UserRole; ver: number }, algorithm: jwt.Algorithm = "HS256"): string {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn as jwt.SignOptions["expiresIn"], algorithm });
}

describe("authnMiddleware", () => {
  it("rejects a request without an Authorization header", () => {
    const req = { headers: {} } as Request;
    const next = jest.fn() as NextFunction;

    expect(() => authnMiddleware(req, {} as Response, next)).toThrow(HttpErrorMiddleware);
  });

  it("rejects a malformed Authorization header", () => {
    const req = { headers: { authorization: "Token abc" } } as unknown as Request;
    const next = jest.fn() as NextFunction;

    expect(() => authnMiddleware(req, {} as Response, next)).toThrow(HttpErrorMiddleware);
  });

  it("rejects an invalid or expired token", () => {
    const req = {
      headers: { authorization: "Bearer not-a-valid-token" },
    } as unknown as Request;
    const next = jest.fn() as NextFunction;

    expect(() => authnMiddleware(req, {} as Response, next)).toThrow(
      "Invalid or expired token",
    );
  });

  it("attaches the decoded payload to req.user and calls next() for a valid token", async () => {
    jest.spyOn(AppDataSource, "getRepository").mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ id: 42, role: UserRole.TOURIST, tokenVersion: 0 }),
    } as never);
    const token = signToken({ sub: 42, role: UserRole.TOURIST, ver: 0 });
    const req = { headers: { authorization: `Bearer ${token}` } } as unknown as Request;
    const next = jest.fn() as NextFunction;

    authnMiddleware(req, {} as Response, next);
    await Promise.resolve();

    expect(req.user).toMatchObject({ sub: 42, role: UserRole.TOURIST });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects tokens signed with another algorithm", () => {
    const token = signToken({ sub: 42, role: UserRole.TOURIST, ver: 0 }, "HS384");
    const req = { headers: { authorization: `Bearer ${token}` } } as unknown as Request;
    expect(() => authnMiddleware(req, {} as Response, jest.fn())).toThrow("Invalid or expired token");
  });
});

describe("authzMiddleware", () => {
  it("rejects when the request has no authenticated user", () => {
    const req = {} as Request;
    const next = jest.fn() as NextFunction;

    expect(() => authzMiddleware(UserRole.ADMIN)(req, {} as Response, next)).toThrow(
      "Not authenticated",
    );
  });

  it("rejects when the user's role is not allowed", () => {
    const req = { user: { sub: 1, role: UserRole.TOURIST, ver: 0 } } as Request;
    const next = jest.fn() as NextFunction;

    expect(() => authzMiddleware(UserRole.ADMIN)(req, {} as Response, next)).toThrow(
      "Insufficient permissions",
    );
  });

  it("calls next() when the user's role is allowed", () => {
    const req = { user: { sub: 1, role: UserRole.ADMIN, ver: 0 } } as Request;
    const next = jest.fn() as NextFunction;

    authzMiddleware(UserRole.ADMIN, UserRole.TOURIST)(req, {} as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
