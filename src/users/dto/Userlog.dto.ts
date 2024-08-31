import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export class UserlogDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
