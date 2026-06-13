import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { DisableMfaDto } from '../dto/disable-mfa.dto';
import { EnableMfaDto } from '../dto/enable-mfa.dto';
import { VerifyMfaDto } from '../dto/verify-mfa.dto';
import { MfaService } from '../services/mfa.service';

@Controller('security/mfa')
export class MfaController {
  constructor(private readonly mfaService: MfaService) {}

  @Post('initialize/:userId')
  initialize(@Param('userId') userId: string) {
    return this.mfaService.initialize(userId);
  }

  @Post('enable')
  enable(@Body() dto: EnableMfaDto) {
    return this.mfaService.enable(dto);
  }

  @Post('verify')
  verify(@Body() dto: VerifyMfaDto) {
    return this.mfaService.verify(dto);
  }

  @Post('disable')
  disable(@Body() dto: DisableMfaDto) {
    return this.mfaService.disable(dto);
  }

  @Get('status/:userId')
  getStatus(@Param('userId') userId: string) {
    return this.mfaService.getStatus(userId);
  }
}