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

  @Post("NotifacitonAdd")
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

  @Get("getIndividualNotifacition")
  getIndividualNotifacition(@Query("bookingId") bookingId: string) {
    const NotifacitionID = parseInt(bookingId);
    return this.Notifacitionservice.getIndividualNotifacition(NotifacitionID);
  }

  @Post("GetbookingID")
  getbookingID(@Query("customerId") customerId: string) {
    const customerID = parseInt(customerId);
    return this.Notifacitionservice.getbookingID(customerID);
  }

  @Post("GetbookingUnique")
  getuniqueNotifacition(@Query("customerId") customerId: string) {
    const customerID = parseInt(customerId);
    return this.Notifacitionservice.getuniqueNotifacition(customerID);
  }

  @Get("getallnotifacition")
  getallnotifacition() {
    return this.Notifacitionservice.getallnotifacition();
  }

}
