import { IsString, IsNotEmpty, IsOptional, Length } from "class-validator";

export class UserotherDto {
  @IsString()
  @IsNotEmpty()
  public ProfileLink: string;

  @IsNotEmpty()
  @IsString()
  public country: String;

  @IsNotEmpty()
  @IsString()
  public email: string;

  @IsOptional()
  @IsString()
  public Province: string;

  @IsNotEmpty()
  @IsString()
  public address: String;
}
