import { IsString, IsNotEmpty, IsOptional, Length } from "class-validator";

export class HotelimageDto {
  
    @IsNotEmpty()
    public hotelId: number; 

    @IsString()
    @IsNotEmpty()
    public caption :string;

    @IsString()
    @IsNotEmpty()
    public  url :string;

}