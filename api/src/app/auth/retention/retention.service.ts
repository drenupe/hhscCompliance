// api/src/app/retention/retention.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { EmailVerification } from '../entities/email-verification.entity';
import { LoginAttempt } from '../entities/login-attempt.entity';
import { PasswordReset } from '../entities/password-reset.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { UserSession } from '../entities/user-session.entity';


const TIMEZONE = process.env.CLEANUP_TZ || 'America/Chicago';
const days = (n: number) => n * 24 * 60 * 60 * 1000;
const cutoff = (daysBack: number) => new Date(Date.now() - days(daysBack));

@Injectable()
export class RetentionService {
  private readonly log = new Logger(RetentionService.name);

  // Retention windows (override via env if desired)
  private readonly keepSessions = Number(process.env.RETAIN_SESSIONS_DAYS ?? 30);
  private readonly keepRefresh = Number(process.env.RETAIN_REFRESH_DAYS ?? 30);
  private readonly keepAttempts = Number(process.env.RETAIN_LOGIN_ATTEMPTS_DAYS ?? 14);
  private readonly keepEmailVer = Number(process.env.RETAIN_EMAIL_VERIF_DAYS ?? 14);
  private readonly keepPwResets = Number(process.env.RETAIN_PASSWORD_RESETS_DAYS ?? 30);

  private enabled() {
    const v = (process.env.CLEANUP_ENABLED ?? 'true').toLowerCase();
    return v === 'true' || v === '1';
  }

  constructor(
    @InjectRepository(UserSession) private readonly sessionRepo: Repository<UserSession>,
    @InjectRepository(RefreshToken) private readonly rtRepo: Repository<RefreshToken>,
    @InjectRepository(LoginAttempt) private readonly laRepo: Repository<LoginAttempt>,
    @InjectRepository(EmailVerification) private readonly evRepo: Repository<EmailVerification>,
    @InjectRepository(PasswordReset) private readonly prRepo: Repository<PasswordReset>,
  ) {}

  // Light tables hourly
  @Cron(CronExpression.EVERY_HOUR, { timeZone: TIMEZONE })
  async hourly() {
    if (!this.enabled()) return;
    await this.cleanupLoginAttempts();
  }

  // Heavier tables nightly (after backups typically)
  @Cron(CronExpression.EVERY_DAY_AT_2AM, { timeZone: TIMEZONE })
  async nightly() {
    if (!this.enabled()) return;
    await this.cleanupSessions();
    await this.cleanupRefreshTokens();
    await this.cleanupEmailVerification();
    await this.cleanupPasswordResets();
  }

  // Returns current config/status (no PHI)
getStatus() {
  return {
    enabled: this.enabled(),
    timeZone: process.env.CLEANUP_TZ || 'America/Chicago',
    windows: {
      sessionsDays: this['keepSessions'],
      refreshTokensDays: this['keepRefresh'],
      loginAttemptsDays: this['keepAttempts'],
      emailVerificationsDays: this['keepEmailVer'],
      passwordResetsDays: this['keepPwResets'],
    },
    schedules: {
      hourly: 'EVERY_HOUR',
      nightly: 'EVERY_DAY_AT_2AM',
    },
    now: new Date().toISOString(),
  };
}


  // --- individual cleanups return counts --- //
  private async cleanupSessions(): Promise<number> {
    const cut = cutoff(this.keepSessions);
    const res = await this.sessionRepo.delete({ revokedAt: LessThan(cut) as any });
    this.log.log(`Sessions cleanup: revoked < ${cut.toISOString()} removed=${res.affected ?? 0}`);
    return res.affected ?? 0;
  }

  private async cleanupRefreshTokens(): Promise<number> {
    const cut = cutoff(this.keepRefresh);
    const res = await this.rtRepo
      .createQueryBuilder()
      .delete()
      .where('revokedAt IS NOT NULL')
      .andWhere('revokedAt < :cut', { cut })
      .execute();
    this.log.log(`RefreshTokens cleanup: revoked < ${cut.toISOString()} removed=${res.affected ?? 0}`);
    return res.affected ?? 0;
  }

  private async cleanupLoginAttempts(): Promise<number> {
    const cut = cutoff(this.keepAttempts);
    const res = await this.laRepo.delete({ createdAt: LessThan(cut) as any });
    this.log.log(`LoginAttempts cleanup: createdAt < ${cut.toISOString()} removed=${res.affected ?? 0}`);
    return res.affected ?? 0;
  }

  private async cleanupEmailVerification(): Promise<number> {
    const cut = cutoff(this.keepEmailVer);
    const res = await this.evRepo.delete({ createdAt: LessThan(cut) as any });
    this.log.log(`EmailVerification cleanup: createdAt < ${cut.toISOString()} removed=${res.affected ?? 0}`);
    return res.affected ?? 0;
  }

  private async cleanupPasswordResets(): Promise<number> {
    const cut = cutoff(this.keepPwResets);
    const res = await this.prRepo.delete({ createdAt: LessThan(cut) as any });
    this.log.log(`PasswordResets cleanup: createdAt < ${cut.toISOString()} removed=${res.affected ?? 0}`);
    return res.affected ?? 0;
  }

  // --- used by /admin/retention/run --- //
  async runAll() {
    if (!this.enabled()) {
      return { enabled: false, ranAt: new Date().toISOString() };
    }
    const [attempts, sessions, rts, ev, pr] = await Promise.all([
      this.cleanupLoginAttempts(),
      this.cleanupSessions(),
      this.cleanupRefreshTokens(),
      this.cleanupEmailVerification(),
      this.cleanupPasswordResets(),
    ]);
    return {
      enabled: true,
      removed: {
        loginAttempts: attempts,
        sessions,
        refreshTokens: rts,
        emailVerifications: ev,
        passwordResets: pr,
      },
      ranAt: new Date().toISOString(),
    };
  }
}
