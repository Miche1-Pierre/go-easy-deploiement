import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateActivityDTO {
  @IsString() @MinLength(2) title!: string;
  @IsString() description!: string;
  @IsString() city!: string;
  @IsString() category!: string;
  @IsString() meetingPoint!: string;
  @IsDateString() startDate!: string;
  @IsInt() @Min(1) durationMinutes!: number;
  @IsNumber() @Min(0) pricePerPerson!: number;
  @IsInt() @Min(1) capacity!: number;
  @IsOptional() @IsString() imageUrl?: string;
}
