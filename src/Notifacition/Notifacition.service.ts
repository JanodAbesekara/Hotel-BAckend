import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { NotifacitionDTO } from "./dto/NotifacitionBook.dto";

@Injectable()
export class Notifacitionservice {
  constructor(private prisma: PrismaService) {}

  async Addnotifacitionwhenbook(dto: NotifacitionDTO) {
    try {
      const { bookingId, message } = dto;
      const createNotifaciton = await this.prisma.NotificationDelegate.create({
        data: {
          bookingId,
          message,
        },
      });
      return { message: "Send the Notifacition" };
    } catch (error) {
      console.error("Error creating room:", error);
      throw new BadRequestException("Could not send the notifacition");
    }
  }

  async sendnotifacition() {
    const sendnotifacition = await this.prisma.NotificationDelegate.findMany();

    try {
      return sendnotifacition;
    } catch (error) {
      console.log("Error send Notifacition", error);
      throw new BadRequestException("Cant send Notifacition");
    }
  }

  async deleteNotifacition(id: number) {
    try {
      await this.prisma.NotificationDelegate.delete({
        where: { bookingId: id },
      });

      return { message: "Notifacition Delete" };
    } catch (error) {
      console.error("Error deleting Notifacition", error);
      throw new BadRequestException("Cant delete Notifacition");
    }
  }
}
