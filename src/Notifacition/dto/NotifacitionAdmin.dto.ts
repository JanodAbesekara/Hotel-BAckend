import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsEnum } from "class-validator";

export class NotifacitionAdminDTO{
    
 
    @IsNotEmpty()
    public  bookingId: number;
}