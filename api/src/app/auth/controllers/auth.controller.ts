// api/src/app/auth/controllers/auth.controller.ts
import {
  Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards,
} from '@nestjs/common';
import { VERSION_NEUTRAL } from '@nestjs/common'; // or use version: '1'
import { Request } from 'express';
import { Throttle, seconds } from '@nestjs/throttler';

import { AuthService } from '../services/auth.service';
import { AccountProtectionService } from '../services/account-protection.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { Public } from '../decorators/public.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // ⬅ adjust import path to your guard

// Option 1: pin to v1
// @Controller({ path: 'auth', version: '1' })

// Option 2: respond both with/without /v1 (recommended while wiring)
// so endpoints work at /api/auth/* AND /api/v1/auth/*
@Controller({ path: 'auth', version: VERSION_NEUTRAL })
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly account: AccountProtectionService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 20, ttl: seconds(60) } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    const ua = req.headers['user-agent'] as string | undefined;
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip;

    return this.auth.issueTokensForUser((user as any).id, {
      ua,
      ip,
      roles: (user as any).roles,
    });
  }
  



  @Public()
  @Throttle({ default: { limit: 10, ttl: seconds(60) } })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.auth.register(dto.email, dto.password);
    return { id: (user as any).id, email: (user as any).email };
  }

  @Public()
  @Throttle({ default: { limit: 20, ttl: seconds(60) } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.auth.refresh(dto.refreshToken);
  }

    // NEW: GET /auth/me (requires access token)
   @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  me(@Req() req: any) {
    const u = req.user;                         // set by JwtAccessStrategy.validate()
    if (!u) throw new UnauthorizedException();  // avoid TypeError
    return {
      id: u.sub,                // NOT u.id
      sessionId: u.sid ?? null,
      roles: Array.isArray(u.roles) ? u.roles : [],
    };
  }

  


  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const sessionId = (req as any).user?.sid || '';
    if (sessionId) await this.auth.logout(sessionId);
    return { success: true };
  }

  
}
