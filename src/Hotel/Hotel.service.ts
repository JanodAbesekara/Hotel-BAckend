import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { HotelDto } from "./dto/Hotelroom.dto";
import { RoomInBookingDto } from "./dto/roominBooking.dto";
import { GetBookingdataDTO } from "./dto/Getbookingdetail.dto";
import { BookingStatus } from "@prisma/client";

@Injectable()
export class HotelService {
  constructor(private prisma: PrismaService) {}

  async addRoomdetails(dto: HotelDto) {
    try {
      const { roomNumber, type, price, hotelId, caption, url } = dto;
      const createroom = await this.prisma.room.create({
        data: {
          roomNumber,
          type,
          price,
          hotelId,
          caption,
          url,
        },
      });

      return { message: "Room created successfully" };
    } catch (error) {
      console.error("Error creating room:", error);
      throw new BadRequestException("Could not create room");
    }
  }

  async getRoomdetails() {
    // Fetch all rooms along with their hotel and image data
    const roomDetails = await this.prisma.room.findMany({
      include: {
        hotel: {
          select: { name: true },
        },
      },
    });

    // Group rooms by roomNumber
    const groupedRooms = roomDetails.reduce((acc, room) => {
      const hotelName = room.hotel?.name || "Unknown Hotel";

      if (!acc[room.roomNumber]) {
        // Initialize the room object with hotel data and an array for images
        acc[room.roomNumber] = {
          id: room.id,
          hotelId: room.hotelId,
          roomNumber: room.roomNumber,
          type: room.type,
          price: room.price,
          availabilityStatus: room.availabilityStatus,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
          hotelname: hotelName,
          images: [
            {
              url: room.url,
              caption: room.caption || "",
            },
          ],
        };
      } else {
        // If already exists, add new image data
        acc[room.roomNumber].images.push({
          url: room.url,
          caption: room.caption || "",
        });
      }

      return acc;
    }, {});

    // Convert grouped object to an array of grouped rooms
    return Object.values(groupedRooms);
  }

  async deleteRoom(roomID: number) {
    try {
      // Delete the room
      await this.prisma.room.delete({
        where: { id: roomID },
      });

      return { message: "Room deleted successfully" };
    } catch (error) {
      console.error("Error deleting room:", error);
      throw new BadRequestException("Could not delete room");
    }
  }
  async roomHoteldetails() {
    // Fetch all hotels along with their rooms
    const hotels = await this.prisma.hotel.findMany({
      include: {
        rooms: {
          select: {
            id: true,
            hotelId: true,
            roomNumber: true,
            type: true,
            price: true,
            availabilityStatus: true,
            createdAt: true,
            updatedAt: true,
            url: true,
            caption: true,
          },
        },
      },
    });
  
    // Process each hotel to group rooms by roomNumber and hotelId
    const formattedHotels = hotels.map((hotel) => {
      const roomGroups: Record<string, any> = {};
  
      hotel.rooms.forEach((room) => {
        const roomKey = `${room.hotelId}-${room.roomNumber}`;
  
        if (!roomGroups[roomKey]) {
          // If this is the first room with this hotelId and roomNumber, create the entry
          roomGroups[roomKey] = {
            ...room,
            images: [{ url: room.url, caption: room.caption }],
          };
        } else {
          // Otherwise, add the image to the existing entry
          roomGroups[roomKey].images.push({ url: room.url, caption: room.caption });
        }
      });
  
      // Return the hotel object with grouped rooms as an array
      return {
        ...hotel,
        rooms: Object.values(roomGroups),
      };
    });
  
    return formattedHotels;
  }
  

  async BookingRooms(dto: RoomInBookingDto) {
    try {
      const {
        roomId,
        customerId,
        bookingDate,
        checkInDate,
        checkOutDate,
        status,
      } = dto;

      const parsedCheckInDate = new Date(checkInDate);
      const parsedCheckOutDate = new Date(checkOutDate);
      const parsedBookingDate = new Date(bookingDate);

      const room = await this.prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        throw new BadRequestException("Room does not exist.");
      }

      if (!room.availabilityStatus && status === "Booked") {
        throw new BadRequestException("Room is already booked.");
      }

      const existingBooking = await this.prisma.booking.findFirst({
        where: {
          roomId,
          customerId,
          status: "Cancelled", // Check if previously canceled
        },
      });

      let booking;
      if (existingBooking) {
        booking = await this.prisma.booking.update({
          where: { id: existingBooking.id },
          data: {
            bookingDate: parsedBookingDate,
            checkInDate: parsedCheckInDate,
            checkOutDate: parsedCheckOutDate,
            status: status, // Update status to new one, e.g. "Booked"
          },
        });
      } else {
        booking = await this.prisma.booking.create({
          data: {
            roomId,
            customerId,
            bookingDate: parsedBookingDate,
            checkInDate: parsedCheckInDate,
            checkOutDate: parsedCheckOutDate,
            status: status,
          },
        });
      }

      if (status === "Booked") {
        await this.prisma.room.update({
          where: { id: roomId },
          data: { availabilityStatus: false },
        });
      }

      if (status === BookingStatus.Cancelled) {
        await this.prisma.room.update({
          where: { id: roomId },
          data: { availabilityStatus: true },
        });
      }

      if (
        parsedCheckInDate.getTime() < Date.now() ||
        parsedCheckOutDate.getTime() < Date.now()
      ) {
        throw new BadRequestException("Invalid check-in or check-out date");
      }

      if (parsedCheckOutDate.getTime() < Date.now()) {
        await this.prisma.room.update({
          where: { id: roomId },
          data: { availabilityStatus: true },
        });

        await this.prisma.booking.update({
          where: { id: booking.id },
          data: { status: "Cancelled" },
        });
      }

      return { message: "Room booking updated successfully", booking };
    } catch (error) {
      console.error("Error booking room:", error);
      throw new BadRequestException("Could not book room");
    }
  }

  async BookingRoomsCancel(dto: RoomInBookingDto) {
    try {
      const { roomId, customerId } = dto;

      // Find the booking to be cancelled based on roomId and customerId
      const bookingDetails = await this.prisma.booking.findFirst({
        where: { roomId: roomId, customerId: customerId },
      });

      // If no booking is found, throw an error
      if (!bookingDetails) {
        throw new Error("Booking not found.");
      }

      // Update the booking status to 'Cancelled'
      await this.prisma.booking.update({
        where: { id: bookingDetails.id }, // Use the booking ID to update
        data: { status: "Cancelled" },
      });

      // Update the room's availability status
      await this.prisma.room.update({
        where: { id: roomId },
        data: { availabilityStatus: true },
      });

      return { message: "Room booking cancelled successfully" };
    } catch (error) {
      console.error("Error cancelling room booking:", error);
      throw new BadRequestException("Could not cancel booking");
    }
  }

  async GetBookingID(dto: GetBookingdataDTO) {
    try {
      const { roomId, customerId } = dto;
      const bookingDetails = await this.prisma.booking.findFirst({
        where: { roomId, customerId },
        orderBy: { updatedAt: "desc" },
      });

      if (!bookingDetails) {
        throw new BadRequestException("Booking not found.");
      } else {
        if (bookingDetails.status === "Booked") {
          return bookingDetails;
        } else if (bookingDetails.status === "Cancelled") {
          return {
            message: "The booking has been canceled and is no longer valid.",
          };
        } else {
          return {
            message: `The booking is not in a "Booked" state. Current status: ${bookingDetails.status}`,
          };
        }
      }
    } catch (error) {
      console.error("Error getting booking details:", error);
      throw new BadRequestException("Could not get booking details");
    }
  }

  async RemoveBooking(roomID: number) {
    try {
      const roomExists = await this.prisma.room.findUnique({
        where: { id: roomID },
      });
      if (!roomExists) {
        throw new BadRequestException("Room not found");
      }

      const bookingExists = await this.prisma.booking.findFirst({
        where: { roomId: roomID },
      });
      if (!bookingExists) {
        throw new BadRequestException("Booking not found for this room");
      }

      await this.prisma.room.update({
        where: { id: roomID },
        data: { availabilityStatus: true },
      });

      await this.prisma.booking.updateMany({
        where: { roomId: roomID },
        data: { status: "Cancelled" },
      });

      return { message: "Booking removed successfully" };
    } catch (error) {
      console.error("Error removing booking:", error);
      throw new BadRequestException("Could not remove booking");
    }
  }
}
