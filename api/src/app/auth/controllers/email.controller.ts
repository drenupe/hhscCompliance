// api/src/app/auth/controllers/email.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../decorators/public.decorator';
import { EmailService } from '../services/email.service';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller({ path: 'auth/email', version: '1' })
export class EmailController {
  constructor(private readonly email: EmailService) {}

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() dto: VerifyEmailDto) {
    return this.email.verify(dto);
  }

  // Authenticated users can request a resend
  @UseGuards(JwtAuthGuard)
  @Post('resend')
  @HttpCode(HttpStatus.OK)
  async resend(@Req() req: Request) {
    // If your service expects a user id, pass (req as any).user?.sub
    return this.email.resendVerification();
  }
}
