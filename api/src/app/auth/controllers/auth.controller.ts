// api/src/app/auth/controllers/auth.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Throttle, seconds } from '@nestjs/throttler';

import { AuthService } from '../services/auth.service';
import { AccountProtectionService } from '../services/account-protection.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { Public } from '../decorators/public.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MfaService } from '../services/mfa.service';

type VerifyMfaBody = { ticket: string; code?: string; backupCode?: string };

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly auth: AuthService,
    private readonly account: AccountProtectionService,
    private readonly mfa: MfaService,
  ) {}

  // -------- REGISTER --------
  @Public()
  @Throttle({ default: { limit: 10, ttl: seconds(60) } })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    const user = await this.auth.register(dto.email, dto.password);
    return { id: (user as any).id, email: (user as any).email };
  }

  // -------- LOGIN (step 1) --------
  @Public()
  @Throttle({ default: { limit: 20, ttl: seconds(60) } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const ua = req.headers['user-agent'] as string | undefined;
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip;

    try {
      return await this.auth.loginOrTicket(dto.email, dto.password, { ua, ip });
    } catch (err) {
      this.logger.error(
        `Login failed for ${dto.email} from ${ip}`,
        (err as any)?.stack,
      );
      throw err;
    }
  }

  // -------- LOGIN (step 2: MFA verify) --------
  @Public()
  @Throttle({ default: { limit: 30, ttl: seconds(60) } })
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  async verifyMfa(@Body() body: VerifyMfaBody, @Req() req: Request) {
    if (!body?.ticket) {
      throw new BadRequestException('ticket is required');
    }

    const { user } = await this.mfa.verifyTicketAndCode(body.ticket, {
      code: body.code,
      backupCode: body.backupCode,
    });

    const ua = req.headers['user-agent'] as string | undefined;
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip;

    try {
      return await this.auth.issueTokensForUser((user as any).id, {
        ua,
        ip,
        roles: (user as any).roles ?? [],
      });
    } catch (err) {
      this.logger.error(
        `MFA verify succeeded but token issuance failed for ${(user as any)?.id}`,
        (err as any)?.stack,
      );
      throw err;
    }
  }

  // -------- REFRESH --------
  @Public()
  @Throttle({ default: { limit: 20, ttl: seconds(60) } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    if (!dto?.refreshToken) throw new BadRequestException('refreshToken is required');
    return this.auth.refresh(dto.refreshToken);
  }

  // -------- ME --------
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  me(@Req() req: any) {
    const u = req.user;
    if (!u) throw new UnauthorizedException();
    return {
      id: u.sub,
      sessionId: u.sid ?? null,
      roles: Array.isArray(u.roles) ? u.roles : [],
    };
  }

  // -------- LOGOUT --------
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const sessionId = (req as any).user?.sid || '';
    if (sessionId) await this.auth.logout(sessionId);
    return { success: true };
  }
}
