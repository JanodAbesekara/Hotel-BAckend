import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaModule } from "../../prisma/prisma.module"; // Import PrismaModule
import { JwtModule } from "@nestjs/jwt";
import { NodemailModule } from "../nodemail/nodemail.module";
import { ConfigModule } from "@nestjs/config";


@Module({
  imports: [PrismaModule, NodemailModule, JwtModule ,ConfigModule.forRoot()],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
