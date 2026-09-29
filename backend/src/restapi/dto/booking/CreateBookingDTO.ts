import { IsInt, Min } from "class-validator";

export class CreateBookingDTO {
  @IsInt() activityId!: number;
  @IsInt() @Min(1) participants!: number;
}
