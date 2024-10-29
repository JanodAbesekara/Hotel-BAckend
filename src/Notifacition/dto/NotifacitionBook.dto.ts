import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsEnum } from "class-validator";

export class NotifacitionDTO{

    @IsOptional()
    public id : number;

    @IsNotEmpty()
    @IsNumber()
    public bookingId : number;
    
    @IsOptional()
    @IsString()
    public message  : string;
    
}