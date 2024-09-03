import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { UserotherDto } from "./dto/Userother.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, Userdetals } from "@prisma/client";

@Injectable()
export class UserOtherService {
  Prisma: any;
  constructor(private readonly prismaService: PrismaService) {}

  async adddetails(dto: UserotherDto) {
    const { ProfileLink, country, address, email,Province } = dto;

    const newuserother = await this.prismaService.Userdetals.create({
      data: {
        ProfileLink,
        country,
        address,
        email,
        Province,
      },
    });

    return { message: "Details added successfully", newuserother };
  }
}
