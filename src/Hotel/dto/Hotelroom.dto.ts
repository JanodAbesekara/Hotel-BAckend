import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from "class-validator";

export class HotelDto {

    @IsNotEmpty()
    @IsNumber()
    public hotelId: number;

    @IsNotEmpty()
    @IsString()
    public roomNumber: string;

    @IsNotEmpty()
    @IsString()
    public type: string;

    @IsNotEmpty()
    @IsNumber()
    public price: number;
}
