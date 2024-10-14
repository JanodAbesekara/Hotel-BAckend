import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsEnum } from "class-validator";

export class NotifacitionDTO{
    @IsNotEmpty()
    @IsNumber()
    public bookingId : number;
    
    @IsOptional()
    @IsString()
    public message : String;
    
}