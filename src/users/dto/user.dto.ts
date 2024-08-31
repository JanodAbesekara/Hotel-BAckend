import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
} from "class-validator";

export class UserDto {
  @IsString()
  @IsNotEmpty()
  public firstname: string;

  @IsString()
  @IsNotEmpty()
  public lastname: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(10, 10, { message: "Phone number must be 10 characters" })
  public PhoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(7, 10, { message: "Password must be between 7 and 10 characters" })
  public password: string;
}
