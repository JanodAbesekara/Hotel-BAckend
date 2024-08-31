import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { NodemailModule } from "./nodemail/nodemail.module";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [UsersModule,MailerModule ,NodemailModule],

  
})
export class AppModule {}
