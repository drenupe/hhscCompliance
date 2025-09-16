// api/src/app/auth/services/mfa.service.ts
import { randomUUID } from 'node:crypto';
import { MfaSecret, MfaType } from '../entities/mfa-secret.entity';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { authenticator } from 'otplib'; // ← simplest, works with current versions

@Injectable()
export class MfaService {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UsersService,
    @InjectRepository(MfaSecret) private readonly mfaRepo: Repository<MfaSecret>,
  ) {
    authenticator.options = {
      window: Number(process.env.TOTP_WINDOW ?? 1),
      step: Number(process.env.TOTP_STEP ?? 30),
      digits: Number(process.env.TOTP_DIGITS ?? 6),
    };
  }

  // ---------- helpers ----------
  private mfaTicketSecret() {
    // Separate secret for MFA tickets; fallback to access secret
    return process.env.MFA_TICKET_SECRET || process.env.JWT_SECRET || 'change-me';
  }

  private issueTicket(payload: Record<string, any>) {
    const ttl = Number(process.env.MFA_TICKET_TTL_SEC ?? 600);
    const jti = randomUUID();
    return this.jwt.sign(
      { ...payload, scope: 'mfa' },
      { expiresIn: ttl, audience: 'mfa', jwtid: jti, secret: this.mfaTicketSecret() },
    );
  }

  private getTotpRow(userId: string): Promise<MfaSecret | null> {
    return this.mfaRepo.findOne({ where: { userId, type: MfaType.TOTP } });
  }

  private isEnabled(row: MfaSecret | null): boolean {
    return !!row?.enabledAt;
  }

  private async requireEnabledTotp(userId: string): Promise<MfaSecret> {
    const row = await this.getTotpRow(userId);
    if (!row || !this.isEnabled(row)) {
      throw new UnauthorizedException('MFA not enabled');
    }
    return row;
  }

  // ---------- login gate ----------
  async beginLoginOrTicket(user: User): Promise<{ mfaRequired: boolean; ticket?: string }> {
    const row = await this.getTotpRow((user as any).id);
    if (!this.isEnabled(row)) return { mfaRequired: false };
    return {
      mfaRequired: true,
      ticket: this.issueTicket({ sub: (user as any).id, email: (user as any).email }),
    };
  }

  async verifyTicketAndCode(
    ticket: string,
    params: { code?: string; backupCode?: string },
  ): Promise<{ ok: true; user: User }> {
    let payload: any;
    try {
      payload = this.jwt.verify(ticket, {
        secret: this.mfaTicketSecret(),
        audience: 'mfa',
      });
      if (payload.scope !== 'mfa') throw new UnauthorizedException('Invalid scope');
    } catch {
      throw new UnauthorizedException('Invalid/expired ticket');
    }

    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException();

    if (params.code) {
      const row = await this.requireEnabledTotp((user as any).id);
      const ok = authenticator.verify({ token: params.code, secret: row.secret });
      if (!ok) throw new BadRequestException('Invalid code');
      // (Optional) mark ticket jti as used here to enforce single-use
      return { ok: true, user };
    }

    if (params.backupCode) {
      // TODO: check hashed backup codes table; mark as used on success
      throw new BadRequestException('Backup codes not enabled');
    }

    throw new BadRequestException('Provide code or backupCode');
  }

  // ---------- setup/enable/disable ----------
  async enableForUser(userId: string, code?: string) {
    let row = await this.getTotpRow(userId);
    if (!row) {
      // TODO: encrypt `secret` at rest (KMS/libsodium)
      const secret = authenticator.generateSecret();
      row = this.mfaRepo.create({
        userId,
        type: MfaType.TOTP,
        secret,
        enabledAt: null,
      } as Partial<MfaSecret> as MfaSecret);
      row = await this.mfaRepo.save(row);
    }

    const user = (await this.users.findById(userId)) as any;
    const issuer = process.env.TOTP_ISSUER ?? 'App';
    const label = user?.email ?? userId; // typical label is the email
    const otpauthUrl = authenticator.keyuri(label, issuer, row.secret);

    if (code) {
      const ok = authenticator.verify({ token: code, secret: row.secret });
      if (!ok) throw new BadRequestException('Invalid code');
      row.enabledAt = new Date();
      await this.mfaRepo.save(row);

      // (Optional) revoke existing sessions here if your policy requires step-up reauth
      return { enabled: true, otpauthUrl };
    }

    return { enabled: this.isEnabled(row), otpauthUrl };
  }

  async disableForUser(userId: string) {
    const row = await this.getTotpRow(userId);
    if (row) {
      row.enabledAt = null;
      await this.mfaRepo.save(row);
      // (Optional) also delete/rotate backup codes
    }
    return { disabled: true };
  }

  // legacy shims
  async enable(_dto: any) {
    throw new BadRequestException('Use enableForUser(userId, code?) from controller');
  }
  async verify(_dto: any) {
    return { verified: true };
  }
  async disable() {
    throw new BadRequestException('Use disableForUser(userId) from controller');
  }
}
