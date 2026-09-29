import { IsInt, IsNumber, IsOptional, Min } from "class-validator";

export class CreateBookingDTO {
  @IsInt()
  activityId!: number;

  @IsInt()
  @Min(1)
  participants!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;
}
