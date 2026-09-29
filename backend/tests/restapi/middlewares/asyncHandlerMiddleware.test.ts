import type { NextFunction, Request, Response } from "express";
import { asyncHandlerMiddleware } from "@restapi/middlewares/asyncHandlerMiddleware";

describe("asyncHandlerMiddleware", () => {
  it("does not call next() when the handler resolves", async () => {
    const next = jest.fn() as NextFunction;
    const handler = asyncHandlerMiddleware(async () => undefined);

    handler({} as Request, {} as Response, next);
    await new Promise((resolve) => setImmediate(resolve));

    expect(next).not.toHaveBeenCalled();
  });

  it("forwards a rejected promise's error to next()", async () => {
    const next = jest.fn() as NextFunction;
    const error = new Error("boom");
    const handler = asyncHandlerMiddleware(async () => {
      throw error;
    });

    handler({} as Request, {} as Response, next);
    await new Promise((resolve) => setImmediate(resolve));

    expect(next).toHaveBeenCalledWith(error);
  });
});
