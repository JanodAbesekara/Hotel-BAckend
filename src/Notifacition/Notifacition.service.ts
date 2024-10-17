import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { NotifacitionDTO } from "./dto/NotifacitionBook.dto";
import { NotifacitionReal } from "./NotifacitionReal";

@Injectable()
export class Notifacitionservice {
  constructor(
    private prisma: PrismaService,
    private notifacitionReal: NotifacitionReal
  ) {}

  async Addnotifacitionwhenbook(dto: NotifacitionDTO) {
    try {
      const { bookingId, message  } = dto;
      const createNotifaciton = await this.prisma.notification.create({
        data: {
          bookingId,
          message,
        },
      });
      this.notifacitionReal.server.emit("newNotification", {
        bookingId,
        message,
      });

      return { message: "Notification Sent" };
    } catch (error) {
      console.error("Error creating room:", error);
      throw new BadRequestException("Could not send the notifacition");
    }
  }

  async sendnotifacition() {
    const sendnotifacition = await this.prisma.notification.findMany();

    try {
      this.notifacitionReal.server.emit("newNotification", sendnotifacition);
      return sendnotifacition;
    } catch (error) {
      console.log("Error send Notifacition", error);
      throw new BadRequestException("Cant send Notifacition");
    }
  }

  async deleteNotifacition(id: number) {
    try {
      await this.prisma.notification.delete({
        where: { id },
      });

      this.notifacitionReal.server.emit("deleteNotification", id);
      return { message: "Notifacition Delete" };
    } catch (error) {
      console.error("Error deleting Notifacition", error);
      throw new BadRequestException("Cant delete Notifacition");
    }
  }
}
