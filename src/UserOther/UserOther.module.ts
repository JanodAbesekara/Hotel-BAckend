import { Module } from "@nestjs/common";
import { UserOtherService } from "./UserOther.service";
import { UserOtherController } from "./UserOther.controller";
import { PrismaModule } from "../../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [PrismaModule, ConfigModule.forRoot()],
  providers: [UserOtherService],
  controllers: [UserOtherController],
})
export class UserOtherModule {}
