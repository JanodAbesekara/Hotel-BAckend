import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { NodemailService } from './nodemail.service';
import { NodemailController } from './nodemail.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule to access environment variables
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule for async configuration
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          auth: {
            user: configService.get<string>('SENDeMAIL'), // Use ConfigService to get environment variables
            pass: configService.get<string>('SENDMAILPASSWORD'),
          },
        },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  providers: [NodemailService],
  controllers: [NodemailController],
  exports: [NodemailService],
})
export class NodemailModule {}
