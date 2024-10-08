import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { FeedbackDto } from "./dto/Feedback.dto";

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async addFeedback(dto: FeedbackDto) {
    try {
      await this.prisma.feedback.create({
        data: {
          bookingId: dto.bookingId,
          customerId: dto.customerId,
          rating: dto.rating,
          comment: dto.comment,
        },
      });
      return { message: "Feedback added successfully" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getFeedback() {
    return await this.prisma.feedback.findMany();
  }

  async getfeedbackbyid(feedbackID: number) {
    return await this.prisma.feedback.findUnique({
      where: { id: feedbackID },
    });
  }

  async deleteFeedback(feedbackID: number) {
    try {
      await this.prisma.feedback.delete({
        where: { id: feedbackID },
      });
      return { message: "Feedback deleted successfully" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
