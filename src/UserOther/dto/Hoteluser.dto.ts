import { IsString, IsNotEmpty, IsOptional, Length } from "class-validator";

export class HoteluserDto {
    
   @IsNotEmpty()
   public adminId: number;

    @IsNotEmpty()
    @IsString()
    public name : string;

    @IsNotEmpty()
    @IsString()
    public location : string;

    @IsNotEmpty()
    @IsString()
    public description : string;


}