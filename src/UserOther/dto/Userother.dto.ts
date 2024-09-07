import { IsString, IsNotEmpty, IsOptional, Length ,IsInt} from "class-validator";

export class UserotherDto {
  @IsString()
  @IsNotEmpty()
  public profileImage: string;

  @IsNotEmpty()
  @IsString()
  public country: string;

  @IsOptional()
  @IsString()
  public province: string;

  @IsNotEmpty()
  @IsString()
  public address: string;

  @IsNotEmpty()
  @IsInt()
  public userId: number;
}
