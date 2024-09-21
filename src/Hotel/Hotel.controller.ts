import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  Param,
  Query,
  Put,
} from "@nestjs/common";
import { HotelService } from "./Hotel.service";
import { HotelDto } from "./dto/Hotelroom.dto";
import { RoomInBookingDto } from "./dto/roominBooking.dto";

@Controller("hotel")
export class HotelController {
  constructor(private readonly HotelService: HotelService) {}

  @Post("addRoomdetails")
  addRoomdetails(@Body() dto: HotelDto) {
    return this.HotelService.addRoomdetails(dto);
  }

  @Get("getRoomdetails")
  getRoomdetails() {
    return this.HotelService.getRoomdetails();
  }

  @Delete("deleteRoom")
  deleteRoom(@Query("id") id: string) {
    const roomID = parseInt(id);
    return this.HotelService.deleteRoom(roomID);
  }

  @Get("roomHoteldetails")
  roomHoteldetails() {
    return this.HotelService.roomHoteldetails();
  }

  @Post("BookingRooms")
  BookingRooms(@Body() dto: RoomInBookingDto) {
    return this.HotelService.BookingRooms(dto);
  }

  @Post("BookingRoomsCancel")
  BookingRoomsCancel(@Body() dto: RoomInBookingDto) {
    return this.HotelService.BookingRoomsCancel(dto);
  }
  
}
