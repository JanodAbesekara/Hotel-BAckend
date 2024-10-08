import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { NodemailModule } from "./nodemail/nodemail.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { NotifacitionModule } from "./Notifacition/Notifacition.module";
import { UserOtherModule } from "./UserOther/UserOther.module";
import { HotelModule } from "./Hotel/Hotel.module";
import { FeedbackModule } from "./Feedback/Feedback.module";

@Module({
  imports: [
    UsersModule,
    MailerModule,
    NodemailModule,
    NotifacitionModule,
    UserOtherModule,
    HotelModule,
    FeedbackModule,
  ],
})
export class AppModule {}
