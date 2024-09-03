import {
  Body,
  Controller,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserotherDto } from "./dto/Userother.dto";
import { UserOtherService } from "./UserOther.service";

@Controller("userother")
export class UserOtherController {
  constructor(private readonly userOtherService: UserOtherService) {}

  @Post("adddetails")
  adddetails(@Body() dto: UserotherDto) {
    return this.userOtherService.adddetails(dto);
  }
}
