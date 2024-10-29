import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { NotifacitionDTO } from "./dto/NotifacitionBook.dto";
import { NotifacitionReal } from "./NotifacitionReal";
import { NotificationGateway } from "./Notification.gateway";

@Injectable()
export class Notifacitionservice {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly notificationGateway: NotificationGateway
  ) {}

  async Addnotifacitionwhenbook(dto: NotifacitionDTO) {
    try {
      const { bookingId, message } = dto;

      

      const createNotifaciton = await this.prisma.notification.create({
        data: {
          bookingId,
          message,
        },
      });
      this.notificationGateway.server.emit("newNotification", {
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
      this.notificationGateway.server.emit("newNotification", sendnotifacition);
      return sendnotifacition;
    } catch (error) {
      console.log("Error send Notifacition", error);
      throw new BadRequestException("Cant send Notifacition");
    }
  }

  // cansel button

  async canselnotifacition(dto: NotifacitionDTO) {
    try {
      await this.prisma.notification.updateMany({
        where: {
          bookingId: dto.bookingId },
        data: { message: dto.message },
      });

      this.notificationGateway.server.emit("deleteNotification", dto);
      return { message: "Notifacition Delete" };
    } catch (error) {
      console.error("Error deleting Notifacition", error);
      throw new BadRequestException("Cant delete Notifacition");
    }
  }

  async getallnotifacition() {
    try {
      // Retrieve all notifications
      const notifications = await this.prisma.notification.findMany({
        select: {
          id: true,
          bookingId: true,
          message: true,
          createdAt: true,
        },
      });

      // Map over notifications to get related data for each notification
      const detailedNotifications = await Promise.all(
        notifications.map(async (notification) => {
          // Get customer details based on bookingId from the notification
          const customerDetails = await this.prisma.booking.findUnique({
            where: { id: notification.bookingId },
            select: {
              id: true,
              roomId: true,
              customerId: true, // Add any other fields needed from booking
            },
          });

          // Check if booking exists
          if (!customerDetails) {
            return { ...notification, customerDetails: null };
          }

          // Get room details for each booking
          const roomDetails = await this.prisma.room.findUnique({
            where: { id: customerDetails.roomId },
            select: {
              roomNumber: true,
              type: true,
              hotelId: true,
              id: true,
            },
          });

          // Get hotel details based on room details
          const hotelDetails = roomDetails
            ? await this.prisma.hotel.findUnique({
                where: { id: roomDetails.hotelId },
                select: {
                  name: true,
                  location: true,
                },
              })
            : null;

          // Return structured data for each notification
          return {
            notification,
            customerDetails,
            roomDetails,
            hotelDetails,
          };
        })
      );

      // Emit all notifications to clients via WebSocket
      this.notificationGateway.server.emit(
        "allNotifications",
        detailedNotifications
      );

      return detailedNotifications;
    } catch (error) {
      console.error("Error getting all notifications", error);
      throw new BadRequestException("Cannot get all notifications");
    }
  }

  async deleteNotifacition(id: number) {
    try {
      await this.prisma.notification.delete({
        where: { id },
      });

      this.notificationGateway.server.emit("deleteNotification", id);
      return { message: "Notifacition Delete" };
    } catch (error) {
      console.error("Error deleting Notifacition", error);
      throw new BadRequestException("Cant delete Notifacition");
    }
  }

  async getIndividualNotifacition(bookingId: number) {
    try {
      const individualNotifacition = await this.prisma.notification.findMany({
        where: { bookingId: bookingId },
      });
      this.notificationGateway.server.emit("individualNotification", bookingId);
      return individualNotifacition;
    } catch (error) {
      console.error("Error getting individual Notifacition", error);
      throw new BadRequestException("Cant get individual Notifacition");
    }
  }

  async getbookingID(customerId: number) {
    try {
      const bookingID = await this.prisma.booking.findMany({
        where: { customerId: customerId },
        select: { id: true },
      });

      return bookingID;
    } catch (error) {
      console.error("Error getting booking ID", error);
      throw new BadRequestException("Cant get booking ID");
    }
  }

  // async getuniqueNotifacition(id: number) {
  //   try {
  //     const getBookiingid = await this.prisma.booking.findMany({
  //       where: { customerId: id },
  //       select: { id: true },
  //     });

  //     const uniqueNotifacition = await this.prisma.notification.findMany({
  //       where: { bookingId: getBookiingid[0].id },
  //     });

  //     this.notifacitionReal.server.emit(
  //       "uniqueNotification",
  //       uniqueNotifacition
  //     );

  //     return uniqueNotifacition;
  //   } catch (error) {
  //     console.error("Error getting unique Notifacition", error);
  //     throw new BadRequestException("Cant get unique Notifacition");
  //   }
  // }

  async getuniqueNotifacition(id: number) {
    try {
      // Retrieve booking IDs for the specified customer
      const bookings = await this.prisma.booking.findMany({
        where: { customerId: id, status: "Booked" },
        select: { id: true },
      });

      // Map over bookings to get related notification data
      const notificationDetails = await Promise.all(
        bookings.map(async (booking) => {
          // Fetch the notification for each booking
          const notification = await this.prisma.notification.findMany({
            where: { bookingId: booking.id },
            select: {
              id: true,
              bookingId: true,
              message: true,
              createdAt: true,
            },
          });

          // Fetch customer details
          const customerDetails = await this.prisma.booking.findUnique({
            where: { id: booking.id },
            select: {
              customerId: true,
              roomId: true,
            },
          });

          // Fetch room details associated with this booking
          const roomDetails = customerDetails
            ? await this.prisma.room.findMany({
                where: {
                  id: customerDetails.roomId,
                  availabilityStatus: false,
                },
                select: {
                  roomNumber: true,
                  type: true,
                  hotelId: true,
                },
              })
            : null;

          // Check if roomDetails has at least one element before trying to access roomDetails[0].hotelId
          const hotelDetails =
            roomDetails && roomDetails.length > 0
              ? await this.prisma.hotel.findMany({
                  where: { id: roomDetails[0].hotelId },
                  select: {
                    name: true,
                    location: true,
                  },
                })
              : null;

          return {
            notification,
            customerDetails,
            roomDetails,
            hotelDetails,
          };
        })
      );
      // Emit data via WebSocket
      this.notificationGateway.server.emit(
        "uniqueNotification",
        notificationDetails
      );

      return notificationDetails;
    } catch (error) {
      console.error("Error getting unique notifications", error);
      throw new BadRequestException("Cannot get unique notifications");
    }
  }
}
