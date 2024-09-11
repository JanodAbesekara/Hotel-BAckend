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
import { UserotherDto } from "./dto/Userother.dto";
import { HoteluserDto } from "./dto/Hoteluser.dto";
import { UserOtherService } from "./UserOther.service";
import { HotelimageDto } from "./dto/Hotelimage.dto";

@Controller("userother")
export class UserOtherController {
  constructor(private readonly userOtherService: UserOtherService) {}

  @Post("adddetails")
  adddetails(@Body() dto: UserotherDto) {
    return this.userOtherService.adddetails(dto);
  }
  @Get("getdetails")
  getdetails(@Query("id") id: string) {
    const userID = parseInt(id); // Convert id from string to number
    return this.userOtherService.getdetails(userID);
  }

  @Post("updatedetails")
  updatedetails(@Query("id") id: string, @Body() dto: UserotherDto) {
    const userID = parseInt(id);
    return this.userOtherService.updatedetails(userID, dto);
  }

  @Delete("deletedetails")
  deletedetails(@Query("id") id: string) {
    const userID = parseInt(id);
    return this.userOtherService.deletedetails(userID);
  }

  @Post("addhotelDetails")
  adddHoteldetails(@Body() dto: HoteluserDto) {
    return this.userOtherService.adddHoteldetails(dto);
  }

  @Get("gethotelDetails")
  getHotelDetails(@Query("id") id: string) {
    const userID = parseInt(id);
    return this.userOtherService.getHotelDetails(userID);
  }

  @Post("AddImagesHotel")
  addImagesHotel(@Body() dto: HotelimageDto) {
    return this.userOtherService.addImagesHotel(dto);
  }

  @Get("getHotelImages")
  getHotelImages(@Query("id") id: string) {
    const userID = parseInt(id);
    return this.userOtherService.getHotelImages(userID);
  }

  @Delete("Deletethepost")
  deletepost(@Query("id") id: string) {
    const userID = parseInt(id);
    return this.userOtherService.deletepost(userID);
  }
}
