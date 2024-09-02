import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { NodemailModule } from "./nodemail/nodemail.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { NotifacitionModule } from "./Notifacition/Notifacition.module";

@Module({
  imports: [UsersModule,MailerModule ,NodemailModule, NotifacitionModule],

  
})
export class AppModule {}
