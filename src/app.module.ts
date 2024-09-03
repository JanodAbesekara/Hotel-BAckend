import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { NodemailModule } from "./nodemail/nodemail.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { NotifacitionModule } from "./Notifacition/Notifacition.module";
import { UserOtherModule } from "./UserOther/UserOther.module";

@Module({
  imports: [
    UsersModule,
    MailerModule,
    NodemailModule,
    NotifacitionModule,
    UserOtherModule,
  ],
})
export class AppModule {}
