import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { UserotherDto } from "./dto/Userother.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class UserOtherService {
  constructor(private readonly prismaService: PrismaService) {}

  async adddetails(dto: UserotherDto) {
    const { ProfileLink, country, address, email } = dto;

    // check the email
    const findUserByEmail = await this.prismaService.Userdetals.findUnique({
      where: { email },
    });

    if (!findUserByEmail) {
      throw new BadRequestException("Firsyly Registed to the system");
    }

    const newuserother = await this.prismaService.Userdetals.create({
      data: {
        ProfileLink,
        country,
        address,
        email,
      },
    });

    return { message: "Details added successfully", newuserother };
  }
}
