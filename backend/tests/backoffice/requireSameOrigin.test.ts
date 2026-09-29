import type { NextFunction, Request, Response } from "express";
import { requireSameOrigin } from "@backoffice/middlewares/requireSameOrigin";

function response() {
  return {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;
}

describe("requireSameOrigin", () => {
  it("accepts a state-changing request from the same host", () => {
    const req = {
      method: "POST",
      get: (name: string) => ({ origin: "https://example.test", host: "example.test" })[name.toLowerCase()],
    } as Request;
    const next = jest.fn() as NextFunction;
    requireSameOrigin(req, response(), next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects a cross-site request", () => {
    const req = {
      method: "POST",
      get: (name: string) => ({ origin: "https://evil.test", host: "example.test" })[name.toLowerCase()],
    } as Request;
    const res = response();
    requireSameOrigin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
