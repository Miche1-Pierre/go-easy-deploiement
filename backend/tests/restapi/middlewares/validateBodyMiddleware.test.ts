import type { NextFunction, Request, Response } from "express";
import { validateBody } from "@restapi/middlewares/validateBodyMiddleware";
import { RegisterDTO } from "@restapi/dto/auth/RegisterDTO";

describe("validateBody", () => {
  it("calls next() with no argument and replaces req.body with the DTO instance when valid", async () => {
    const req = {
      body: {
        email: "jane@doe.com",
        password: "azerty1",
        firstName: "Jane",
        lastName: "Doe",
      },
    } as Request;
    const next = jest.fn() as NextFunction;

    await validateBody(RegisterDTO)(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toBeInstanceOf(RegisterDTO);
  });

  it("calls next() with the list of validation errors when invalid", async () => {
    const req = {
      body: { email: "not-an-email", password: "abc", firstName: "", lastName: "Doe" },
    } as Request;
    const next = jest.fn() as NextFunction;

    await validateBody(RegisterDTO)(req, {} as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    const [details] = (next as jest.Mock).mock.calls[0] as [Array<{ property: string }>];
    expect(Array.isArray(details)).toBe(true);
    expect(details.map((d) => d.property).sort()).toEqual(["email", "firstName", "password"]);
  });

  it("rejects unexpected extra fields (whitelist / forbidNonWhitelisted)", async () => {
    const req = {
      body: {
        email: "jane@doe.com",
        password: "azerty1",
        firstName: "Jane",
        lastName: "Doe",
        isSuperAdmin: true,
      },
    } as Request;
    const next = jest.fn() as NextFunction;

    await validateBody(RegisterDTO)(req, {} as Response, next);

    const [details] = (next as jest.Mock).mock.calls[0] as [Array<{ property: string }>];
    expect(details.some((d) => d.property === "isSuperAdmin")).toBe(true);
  });
});
