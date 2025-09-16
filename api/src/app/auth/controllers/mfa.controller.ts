import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MfaService } from '../services/mfa.service';
import { EnableMfaDto } from '../dto/enable-mfa.dto';
import { VerifyMfaDto } from '../dto/verify-mfa.dto';

@UseGuards(JwtAuthGuard)
@Controller({path:'auth/mfa', version: '1'})
export class MfaController {

 constructor(private mfa: MfaService) { }
 
 @Post('enable')
  async enable(@Req() req: Request, @Body() dto: EnableMfaDto) {
    const userId = (req as any).user?.sub;
    return this.mfa.enableForUser(userId, dto.code);  // ← no "as any"
  }

  // (Guarded) verify under MfaController is optional; login verification should use /auth/mfa/verify (Public) in AuthController.
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() _dto: VerifyMfaDto) {
    return this.mfa.verify(_dto);
  }

  @Post('disable')
  @HttpCode(HttpStatus.OK)
  async disable(@Req() req: Request) {
    const userId = (req as any).user?.sub;
    return this.mfa.disableForUser(userId);
  }
}
