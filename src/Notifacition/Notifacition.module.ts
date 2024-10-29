// notifacition.module.ts
import { Module, forwardRef } from "@nestjs/common";
import { NotifacitionReal } from "./NotifacitionReal";
import { Notifacitionservice } from "./Notifacition.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { Notifacitioncontroller } from "./Notifacition.controller";
import { NotificationGateway } from "./Notification.gateway";

@Module({
  imports: [PrismaModule, ConfigModule.forRoot()],
  providers: [
    NotifacitionReal,
    Notifacitionservice,
    NotificationGateway, // Use NotificationGateway directly
  ],
  controllers: [Notifacitioncontroller],
  exports: [Notifacitionservice, NotificationGateway],
})
export class NotifacitionModule {}
