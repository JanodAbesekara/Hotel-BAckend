import {
    Body,
    Controller,
    Get,
    Param,
    Query,
    Post,
    Req,
    Res,
    UseGuards,
  } from "@nestjs/common";
  import { UserotherDto } from "./dto/Userother.dto";
  import { UserOtherService } from "./UserOther.service";
  
  @Controller("UserOther")
  export class UserOtherController{
     UserOtherService: any;
     @Post("Filldetails")
     adddetails(@Body() dto: UserotherDto) {
       return this.UserOtherService.adddetails(dto);
     }
  }