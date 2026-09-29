import { HttpErrorMiddleware } from "@restapi/middlewares/HttpErrorMiddleware";

describe("HttpErrorMiddleware", () => {
  it("carries the HTTP status and message", () => {
    const error = new HttpErrorMiddleware(404, "Hotel not found");

    expect(error.status).toBe(404);
    expect(error.message).toBe("Hotel not found");
    expect(error.name).toBe("HttpError");
  });

  it("is a genuine Error instance", () => {
    const error = new HttpErrorMiddleware(500, "Internal server error");

    expect(error).toBeInstanceOf(Error);
  });
});
