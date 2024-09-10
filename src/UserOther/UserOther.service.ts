import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service"; // Assuming you're using PrismaService
import { UserotherDto } from "./dto/Userother.dto";
import { HoteluserDto } from "./dto/Hoteluser.dto";

@Injectable()
export class UserOtherService {
  constructor(private prisma: PrismaService) {}

  async adddetails(dto: UserotherDto) {
    const { userId, profileImage, country, province, address } = dto as {
      userId: number;
      profileImage: string;
      country: string;
      province: string;
      address: string;
    };

    // Now proceed with creating the profile since the user exists
    const createnewuser = await this.prisma.profile.create({
      data: {
        profileImage,
        country,
        province,
        address,
        userId,
      },
    });

    return { message: "Profile created successfully" };
  }

  async getdetails(userId: number) {
    const userDetails = await this.prisma.uSer.findUnique({
      where: { id: userId },
      include: {
        profile: true, // Include related data, such as profile, if necessary
      },
    });

    if (!userDetails) {
      throw new Error("User not found");
    }

    return userDetails;
  }

  async updatedetails(userId: number, dto: UserotherDto) {
    const { profileImage, country, province, address } = dto as {
      profileImage: string;
      country: string;
      province: string;
      address: string;
    };

    // Update the user's profile
    const updateProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        profileImage,
        country,
        province,
        address,
      },
    });

    return { message: "Profile updated successfully" };
  }

  async deletedetails(userId: number) {
    const deleteProfile = await this.prisma.profile.delete({
      where: { userId },
    });

    return { message: "Profile deleted successfully" };
  }

  async adddHoteldetails(dto: HoteluserDto) {
    const { adminId, name, location, description } = dto;
  
    const createHotel = await this.prisma.hotel.create({
      data: {
        name,
        location,
        description,
        admin: {
          connect: { id: adminId } // Link to existing admin
        }
      }
    });
  
    return { createHotel };
  }
  
}
