import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Notifacitionservice } from "./Notifacition.service";
import { NotifacitionDTO } from "./dto/NotifacitionBook.dto";
import { forwardRef, Inject } from "@nestjs/common";

@WebSocketGateway(8002, {
  cors: {
    origin: "*",
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => Notifacitionservice))
    private readonly notificationService: Notifacitionservice
  ) {}

  // tester the connection
  @SubscribeMessage("")
  handleNewMessage(client: any, message: any): string {
    return "This is a reply";
  }

  // Event to add a new notification when a booking is made
  @SubscribeMessage("addNotification")
  async addNotification(@MessageBody() dto: NotifacitionDTO) {
    try {
      const notification = await this.notificationService.Addnotifacitionwhenbook(
        dto
      );
      this.server.emit("newNotification", notification);
      return notification;
    } catch (error) {
      return { error: "Error creating notification." };
    }
  }

  // Event to retrieve all notifications
  @SubscribeMessage("getAllNotifications")
  async getAllNotifications(client: Socket) {
    try {
      const notifications = await this.notificationService.getallnotifacition();
      client.emit("allNotifications", notifications);
      return notifications;
    } catch (error) {
      return { error: "Error retrieving notifications." };
    }
  }

  // Event to delete a specific notification by ID
  @SubscribeMessage("deleteNotification")
  async deleteNotification(@MessageBody() id: number) {
    try {
      await this.notificationService.deleteNotifacition(id);
      this.server.emit("notificationDeleted", id);
      return { message: "Notification deleted successfully." };
    } catch (error) {
      return { error: "Error deleting notification." };
    }
  }

  // Event to retrieve a notification for a specific booking
  @SubscribeMessage("getIndividualNotification")
  async getIndividualNotification(
    @MessageBody() bookingId: number,
    client: Socket
  ) {
    try {
      const notification = await this.notificationService.getIndividualNotifacition(
        bookingId
      );
      client.emit("individualNotification", notification);
      return notification;
    } catch (error) {
      return { error: "Error retrieving individual notification." };
    }
  }

  // Event to retrieve notifications related to a specific customer
  @SubscribeMessage("getUniqueNotifications")
  async getUniqueNotifications(@MessageBody() customerId: number) {
    try {
      const uniqueNotifications = await this.notificationService.getuniqueNotifacition(
        customerId
      );
      this.server.emit("uniqueNotifications", uniqueNotifications);
      return uniqueNotifications;
    } catch (error) {
      return { error: "Error retrieving unique notifications." };
    }
  }

  // Canseled the booking notifacition

  @SubscribeMessage("canceledBooking")
  async canselnotifacition(@MessageBody() dto: NotifacitionDTO) {
  try{
    const notifacitionupdate = await this.notificationService.canselnotifacition(dto);
    this .server.emit("canceledBooking", notifacitionupdate);
    return notifacitionupdate;
  }catch(error){
    return { error: "Error creating notification." };
  }
  }
}
