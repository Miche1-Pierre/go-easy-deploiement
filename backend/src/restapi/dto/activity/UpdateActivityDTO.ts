import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateActivityDTO {
  @IsOptional() @IsString() @MinLength(2) title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() meetingPoint?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsInt() @Min(1) durationMinutes?: number;
  @IsOptional() @IsNumber() @Min(0) pricePerPerson?: number;
  @IsOptional() @IsInt() @Min(1) capacity?: number;
  @IsOptional() @IsString() imageUrl?: string;
}
