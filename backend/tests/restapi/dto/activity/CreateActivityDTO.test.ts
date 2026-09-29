import { validate } from "class-validator";
import { CreateActivityDTO } from "@restapi/dto/activity/CreateActivityDTO";
function makeDto(overrides: Partial<CreateActivityDTO> = {}) { const dto = new CreateActivityDTO(); Object.assign(dto, { title: "Visite guidée", description: "Centre historique", city: "Nancy", category: "Patrimoine", meetingPoint: "Place Stanislas", startDate: "2027-08-01T10:00:00.000Z", durationMinutes: 90, pricePerPerson: 15, capacity: 12 }, overrides); return dto; }
describe("CreateActivityDTO", () => {
  it("accepts a valid activity", async () => expect(await validate(makeDto())).toHaveLength(0));
  it("rejects an invalid date", async () => expect((await validate(makeDto({ startDate: "tomorrow" }))).map(e => e.property)).toContain("startDate"));
  it("rejects a zero capacity", async () => expect((await validate(makeDto({ capacity: 0 }))).map(e => e.property)).toContain("capacity"));
});
