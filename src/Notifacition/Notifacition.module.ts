import { Module } from "@nestjs/common";
import { NotifacitionReal } from "./NotifacitionReal";
import { Notifacitionservice } from "./Notifacition.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { Notifacitioncontroller } from "./Notifacition.controller";


@Module({
  imports:[PrismaModule, ConfigModule.forRoot()],
  providers:[NotifacitionReal,Notifacitionservice],
  controllers:[Notifacitioncontroller],
})

export class NotifacitionModule {}