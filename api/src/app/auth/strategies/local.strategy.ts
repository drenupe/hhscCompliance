// api/src/app/auth/strategies/local.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private auth: AuthService) { super({ usernameField: 'email', passwordField: 'password' }); }
  async validate(email: string, password: string) {
    // Delegate to AuthService.validateUser (implement there)
    return this.auth.validateUser(email, password);
  }
}