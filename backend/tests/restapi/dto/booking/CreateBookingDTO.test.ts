import { validate } from "class-validator";
import { CreateBookingDTO } from "@restapi/dto/booking/CreateBookingDTO";
function makeDto(overrides: Partial<CreateBookingDTO> = {}) { const dto = new CreateBookingDTO(); dto.activityId = 1; dto.participants = 2; Object.assign(dto, overrides); return dto; }
describe("CreateBookingDTO", () => {
  it("accepts a valid booking", async () => expect(await validate(makeDto())).toHaveLength(0));
  it("rejects a non-integer activity id", async () => expect((await validate(makeDto({ activityId: 1.5 }))).map(e => e.property)).toContain("activityId"));
  it("rejects zero participants", async () => expect((await validate(makeDto({ participants: 0 }))).map(e => e.property)).toContain("participants"));
});
