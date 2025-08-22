// api/src/app/auth/controllers/email.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { EmailService } from '../services/email.service';
import { VerifyEmailDto } from '../dto/verify-email.dto';

@Controller('auth/email')
export class EmailController {
  constructor(private email: EmailService) {}

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() dto: VerifyEmailDto) { return this.email.verify(dto); }

  @Post('resend')
  @UseGuards() // add JwtAuthGuard if you want only logged-in users to request resend
  async resend() { return this.email.resendVerification(); }
}