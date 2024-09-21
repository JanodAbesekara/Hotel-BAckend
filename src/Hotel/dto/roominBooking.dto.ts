import { BookingStatus } from "@prisma/client";
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsEnum } from "class-validator";

export class RoomInBookingDto {

    @IsNotEmpty()
    @IsNumber()
    public roomId: number;

    @IsNotEmpty()
    public customerId: number;

    @IsNotEmpty()
    @IsOptional()
    public bookingDate: Date;

    @IsNotEmpty()
    @IsOptional()
    public checkInDate: Date;

    @IsNotEmpty()
    @IsOptional()
    public  checkOutDate: Date;

    @IsNotEmpty()
    @IsOptional()
    @IsEnum(BookingStatus)
    public status: BookingStatus;


};