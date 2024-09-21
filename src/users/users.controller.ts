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
  Delete,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDto } from "./dto/user.dto";
import { UserlogDto } from "./dto/Userlog.dto";
import { ForgotPasswordDto } from "./dto/forget.dto";
import { ResetPasswordDto } from "./dto/resetpass.dto";
import { query } from "express";


@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("signup")
  signup(@Body() dto: UserDto) {
    return this.usersService.signup(dto);
  }

  @Post("signin") 
  signin(@Body() dto: UserlogDto, @Req() req, @Res() res) {
    return this.usersService.signin(dto, req, res);
  }

  @Get("signout")
  signout(@Req() req, @Res() res) {
    return this.usersService.signout(req, res);
  }

I 
  @Get("verify-email")
  verifyEmail(@Query("token") token: string) {
    return this.usersService.verifyEmail(token);
  }


  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  @Get('AdminData')
  getadmindata(){
    return this.usersService.getadmindata();
  }

  @Post('CreateAdmin')
  creteadmin(@Query('email') email:string){
    return this.usersService.creteadmin(email);
  }

  @Delete('DeleteAdmin')
  deleteAdmin(@Query('email') email:string){
    return this.usersService.deleteAdmin(email);
  }


}
function NoAccountGuard(): (target: UsersController, propertyKey: "") => void {
  throw new Error("Function not implemented.");
}
