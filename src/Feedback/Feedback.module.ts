import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { FeedbackService } from "./Feedback.service";
import { FeedbackController } from "./Feedback.controller";

@Module({
  imports: [PrismaModule, ConfigModule.forRoot()],
  providers: [FeedbackService],
  controllers: [FeedbackController],
})
export class FeedbackModule {}