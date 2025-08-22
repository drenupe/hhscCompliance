// api/src/app/auth/services/account-protection.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { LoginAttempt } from '../entities/login-attempt.entity';

type LockCheck = { locked: boolean; retryAt?: Date };

@Injectable()
export class AccountProtectionService {
  // policy: 5 failures in 15m → lock for remainder of that 15m window
  private readonly windowMs = 15 * 60 * 1000;
  private readonly threshold = 5;

  constructor(
    @InjectRepository(LoginAttempt)
    private readonly repo: Repository<LoginAttempt>,
  ) {}

  async recordAttempt(email: string | null, ip: string | null, succeeded: boolean) {
    const a = this.repo.create({ email: email?.toLowerCase() ?? null, ip, succeeded });
    await this.repo.save(a);
  }

  async isLocked(email: string | null, ip: string | null): Promise<LockCheck> {
    const since = new Date(Date.now() - this.windowMs);
    const emailLc = email?.toLowerCase() ?? null;

    const where = [
      { succeeded: false, createdAt: MoreThan(since), email: emailLc },
      { succeeded: false, createdAt: MoreThan(since), ip },
    ];

    // count distinct failures across email OR ip in the window
    const [emailFails, ipFails] = await Promise.all([
      emailLc ? this.repo.count({ where: where[0] }) : Promise.resolve(0),
      ip ? this.repo.count({ where: where[1] }) : Promise.resolve(0),
    ]);

    const failures = Math.max(emailFails, ipFails);
    if (failures < this.threshold) return { locked: false };

    // compute retryAt = last failure + window
    const last = await this.repo.findOne({
      where: [
        ...(emailLc ? [where[0]] : []),
        ...(ip ? [where[1]] : []),
      ],
      order: { createdAt: 'DESC' },
    });

    const retryAt = last ? new Date(last.createdAt.getTime() + this.windowMs) : undefined;
    if (retryAt && retryAt <= new Date()) return { locked: false };
    return { locked: true, retryAt };
  }
}
