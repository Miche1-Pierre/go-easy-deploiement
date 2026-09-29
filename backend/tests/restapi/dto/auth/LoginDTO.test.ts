import { validate } from "class-validator";
import { LoginDTO } from "@restapi/dto/auth/LoginDTO";

describe("LoginDTO", () => {
  it("passes validation with a valid email and non-empty password", async () => {
    const dto = new LoginDTO();
    dto.email = "jane@doe.com";
    dto.password = "azerty1";

    expect(await validate(dto)).toHaveLength(0);
  });

  it("rejects an invalid email", async () => {
    const dto = new LoginDTO();
    dto.email = "not-an-email";
    dto.password = "azerty1";

    const errors = await validate(dto);
    expect(errors.map((e) => e.property)).toContain("email");
  });

  it("rejects an empty password", async () => {
    const dto = new LoginDTO();
    dto.email = "jane@doe.com";
    dto.password = "";

    const errors = await validate(dto);
    expect(errors.map((e) => e.property)).toContain("password");
  });
});
