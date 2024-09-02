import { Body, Controller, Post } from "@nestjs/common";
import { NodemailService } from "./nodemail.service";
import { sendEmailDto } from "./nodemail.interface"; // Corrected the import path

@Controller("nodemail")
export class NodemailController {
  constructor(private readonly nodemailService: NodemailService) {}

  @Post("/sendEmail")
  async sendEmail(@Body() body: Record<string, string>) {
    console.log("Sending email with body:", body);
    const { fromName, fromAddress, recipientName, recipientAddress } = body;

    // Build the DTO for sending the email
    const DTO: sendEmailDto = {
      from: {
        name: fromName || "Default Name",
        address: fromAddress || "default@example.com",
      },
      recipients: [
        {
          name: recipientName || "Default Recipient",
          address: recipientAddress,
        },
      ],
      subject: "Verify your account",
      html: `<h1>Verify your ${recipientName || "User"} account</h1>`,
      placeholderReplacement: body,
    };

    // Map sendEmailDto to the expected format


    const mailOptions = {
      to: DTO.recipients[0].address,  // Assuming one recipient
      subject: DTO.subject,
      html: DTO.html,
      from: `${DTO.from.name} <${DTO.from.address}>`,
    };

    return await this.nodemailService.sendMail(mailOptions);
  }
}
