import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDto } from "./dto/user.dto";
import { UserlogDto } from "./dto/Userlog.dto";
import { ForgotPasswordDto } from "./dto/forget.dto";
import { ResetPasswordDto } from "./dto/resetpass.dto";


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

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

}
function NoAccountGuard(): (target: UsersController, propertyKey: "") => void {
  throw new Error("Function not implemented.");
}
