import { extractAdminError } from "@backoffice/utils";

describe("extractAdminError", () => {
  it("returns the message of an Error instance", () => {
    expect(extractAdminError(new Error("boom"))).toBe("boom");
  });

  it("returns a generic message for non-Error values", () => {
    expect(extractAdminError("boom")).toBe("Une erreur est survenue");
    expect(extractAdminError(null)).toBe("Une erreur est survenue");
    expect(extractAdminError(undefined)).toBe("Une erreur est survenue");
  });
});
