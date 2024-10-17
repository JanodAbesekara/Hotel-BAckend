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
      const { roomNumber, type, price, hotelId } = dto;
      const createroom = await this.prisma.room.create({
        data: {
          roomNumber,
          type,
          price,
          hotelId,
        },
      });

      return { message: "Room created successfully" };
    } catch (error) {
      console.error("Error creating room:", error);
      throw new BadRequestException("Could not create room");
    }
  }

  async getRoomdetails() {
    // Fetch all room details
    const roomdetails = await this.prisma.room.findMany();

    // For each room, get the hotel name and append it to the room data
    const allhoteldata = await Promise.all(
      roomdetails.map(async (room) => {
        const hotel = await this.prisma.hotel.findUnique({
          where: { id: room.hotelId },
          select: { name: true },
        });

        return {
          ...room,
          hotelname: hotel?.name || "Unknown Hotel", // Provide a default value in case hotel is not found
        };
      })
    );

    return allhoteldata;
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
    const hotelDetails = await this.prisma.hotel.findMany({
      include: {
        rooms: true, // Include room details
        images: true, // Include image details
      },
    });

    return hotelDetails;
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
}
