import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class NodemailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        from: "janodabesekara91@gmail.com",
        subject: options.subject,
        html: options.html,
      });
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error("Failed to send email:", error.message, error);
      throw new Error("Failed to send email");
    }
  }
}
