import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  Max,
  Min,
} from "class-validator";

export class FeedbackDto {
  @IsNotEmpty()
  @IsNumber()
  public bookingId: number;

  @IsNotEmpty()
  @IsNumber()
  public customerId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  public rating: number; 

  @IsOptional()
  @IsString()
  public comment?: string; 
}
