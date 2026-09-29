import { validate } from "class-validator";
import { RegisterDTO } from "@restapi/dto/auth/RegisterDTO";

function makeDto(overrides: Partial<RegisterDTO> = {}): RegisterDTO {
  const dto = new RegisterDTO();
  dto.email = "jane@doe.com";
  dto.password = "azerty1";
  dto.firstName = "Jane";
  dto.lastName = "Doe";
  Object.assign(dto, overrides);
  return dto;
}

describe("RegisterDTO", () => {
  it("passes validation with valid fields", async () => {
    const errors = await validate(makeDto());
    expect(errors).toHaveLength(0);
  });

  it("rejects an invalid email", async () => {
    const errors = await validate(makeDto({ email: "not-an-email" }));
    expect(errors.map((e) => e.property)).toContain("email");
  });

  it("rejects a password shorter than 6 characters", async () => {
    const errors = await validate(makeDto({ password: "abc" }));
    expect(errors.map((e) => e.property)).toContain("password");
  });

  it("rejects an empty firstName or lastName", async () => {
    const errors = await validate(makeDto({ firstName: "", lastName: "" }));
    expect(errors.map((e) => e.property).sort()).toEqual(["firstName", "lastName"]);
  });
});
