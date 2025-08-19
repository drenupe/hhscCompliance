// api/src/app/auth/controllers/mfa.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MfaService } from '../services/mfa.service';
import { EnableMfaDto } from '../dto/enable-mfa.dto';
import { VerifyMfaDto } from '../dto/verify-mfa.dto';

@UseGuards(JwtAuthGuard)
@Controller('auth/mfa')
export class MfaController {
  constructor(private mfa: MfaService) {}

  @Post('enable')
  async enable(@Body() dto: EnableMfaDto) { return this.mfa.enable(dto); }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() dto: VerifyMfaDto) { return this.mfa.verify(dto); }

  @Post('disable')
  @HttpCode(HttpStatus.OK)
  async disable() { return this.mfa.disable(); }
}