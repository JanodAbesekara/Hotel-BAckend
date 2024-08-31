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


}
function NoAccountGuard(): (target: UsersController, propertyKey: "") => void {
  throw new Error("Function not implemented.");
}
