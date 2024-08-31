import { Controller, Get, Query } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.usersService.verifyEmail(token);
  }
}
