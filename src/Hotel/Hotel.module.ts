import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { HotelService } from "./Hotel.service";
import { HotelController } from "./Hotel.controller";

@Module({
  imports: [PrismaModule, ConfigModule.forRoot()],
  providers: [HotelService],
  controllers: [HotelController],
})
export class HotelModule {}
