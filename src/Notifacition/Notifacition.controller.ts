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
import { Notifacitionservice } from "./Notifacition.service";
import { NotifacitionDTO } from "./dto/NotifacitionBook.dto";

@Controller("Notifacition")
export class Notifacitioncontroller {
  constructor(private Notifacitionservice: Notifacitionservice) {}

  @Post("Notifacitonsend")
  notifacitionsend(@Body() dto: NotifacitionDTO) {
    return this.Notifacitionservice.Addnotifacitionwhenbook(dto);
  }

  @Get("sendnotifacition")
  sendnotifacition() {
    return this.Notifacitionservice.sendnotifacition();
  }

  @Delete("Deletenotifacition")
  deletenotifacition(@Query("id") id: string) {
    const NotifacitionID = parseInt(id);
    return this.Notifacitionservice.deleteNotifacition(NotifacitionID);
  }
}
