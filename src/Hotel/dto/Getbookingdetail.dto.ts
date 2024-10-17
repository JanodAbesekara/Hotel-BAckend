import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from "class-validator";

export class GetBookingdataDTO{

    @IsNotEmpty()
    @IsNumber()
    public  roomId: number;

    @IsNotEmpty()
    @IsNumber()
    public customerId: number;
}