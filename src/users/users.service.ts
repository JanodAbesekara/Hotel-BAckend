import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import * as bcrypt from "bcrypt";
import { Prisma, USer } from "@prisma/client"; // Corrected the import for `User`
import { PrismaService } from "prisma/prisma.service";
import { UserlogDto } from "./dto/Userlog.dto";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { NodemailService } from "../nodemail/nodemail.service"; // Import NodemailService
import { ForgotPasswordDto } from "./dto/forget.dto";
import { ResetPasswordDto } from "./dto/resetpass.dto";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private nodemailService: NodemailService // Inject NodemailService
  ) {}

  async signup(dto: UserDto) {
    const { firstname, lastname, email, PhoneNumber, password } = dto;

    // Check if the email already exists
    const findUserByEmail = await this.prisma.uSer.findUnique({
      where: { email },
    });
    if (findUserByEmail) {
      throw new BadRequestException("User with this email already exists");
    }

    // Check if the PhoneNumber already exists
    const findUserByPhoneNumber = await this.prisma.uSer.findUnique({
      where: { PhoneNumber },
    });
    if (findUserByPhoneNumber) {
      throw new BadRequestException(
        "User with this phone number already exists"
      );
    }

    // Hash the password
    const hashpassword = await this.hashPassword(password);

    // Create new user
    const newUser = await this.prisma.uSer.create({
      data: {
        firstname,
        lastname,
        email,
        PhoneNumber,
        hashpassword,
      },
    });

   

    // Create a verification token
    const token = await this.createtoken({ email: newUser.email });
    const link = `http://localhost:3000/verify?token=${token}`;

    // Send verification emailHow many millions
    await this.sendConformEmail(newUser.email, link);

    return {
      message:
        "Signup successful. Please check your email to verify your account.",
    };
  }

  async signin(dto: UserlogDto, req: Request, res: Response) {
    const { email, password } = dto;

    // Find user by email
    const findUser:
      | (USer & { verified: boolean })
      | null = await this.prisma.uSer.findUnique({ where: { email } });
    if (!findUser) {
      throw new BadRequestException("User not found");
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, findUser.hashpassword);
    if (!isMatch) {
      throw new BadRequestException("Invalid password");
    }

    if (findUser.verified !== true) {
      // Use strict comparison
      throw new BadRequestException("User not verified");
    }
    // Generate JWT token
    const token = await this.signtoken({
      email: findUser.email,
      id: findUser.id,
      phoneNumber: findUser.PhoneNumber,
      firstname: findUser.firstname,
      lastname: findUser.lastname,
    });

    if (!token) {
      throw new ForbiddenException();
    }
    // Set token as a cookie in the response
    // res.cookie("token", token);
    // return res.send({ message: "Signin success" });

    // Send the token as a response
    return res.send({ token });
  }

  async signout(req: Request, res: Response) {
    // Clear the authentication token
    // res.clearCookie("token");

    return res.send({ message: "Signout success" });
  }

  async hashPassword(password: string) {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  }

  async signtoken(payload: {
    email: string;
    id: number;
    phoneNumber: string;
    firstname: string;
    lastname: string;
  }) {
    return this.jwt.sign(payload, { secret: process.env.JWT_SECRET });
  }

  async createtoken(payload: { email: string }) {
    return this.jwt.sign(payload, { secret: process.env.JWT_SECRET });
  }

  async sendConformEmail(email: string, link: string) {
    await this.nodemailService.sendMail({
      to: email,
      subject: "Verify your account",
      html: `<h1>Verify your account</h1><p>Click <a href="${link}">here</a> to verify your account.</p>`,
    });
  }

  async verifyEmail(token: string) {
    try {
      // Verify the token
      const decoded = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const { email } = decoded;

      // Find user by email
      const user = await this.prisma.uSer.findUnique({ where: { email } });

      if (!user) {
        throw new BadRequestException("Invalid token or user does not exist.");
      }

      if (user.verified === true) {
        throw new BadRequestException("User is already verified.");
      }

      // Update the user to set verified to true
      await this.prisma.uSer.update({
        where: { email },
        data: { verified: true } as Prisma.USerUpdateInput, // Add type assertion
      });

      return { message: "Email verified successfully." };
    } catch (error) {
      throw new BadRequestException("Invalid or expired token.");
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.uSer.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException("User with this email does not exist");
    }

    // Generate a reset token
    const resetToken = this.jwt.sign(
      { email: user.email },
      { secret: process.env.JWT_SECRET, expiresIn: "1h" }
    );

    // Create a reset password link
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Send reset password email
    await this.nodemailService.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });

    return { message: "Password reset link sent to your email" };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      // Verify the token
      const decoded = this.jwt.verify(dto.token, {
        secret: process.env.JWT_SECRET,
      });
      const { email } = decoded;

      // Find user by email
      const user = await this.prisma.uSer.findUnique({ where: { email } });

      if (!user) {
        throw new BadRequestException("Invalid token or user does not exist.");
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

      // Update the user's password
      await this.prisma.uSer.update({
        where: { email },
        data: { hashpassword: hashedPassword },
      });

      return { message: "Password reset successfully" };
    } catch (error) {
      throw new BadRequestException("Invalid or expired token.");
    }
  }
}
