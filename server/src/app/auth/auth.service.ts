import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/services/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordService } from './services/password.service';
import { TokensService } from './services/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokensService: TokensService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.passwordService.hash(dto.password);

    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      roles: [],
    });

    const accessToken = await this.tokensService.signAccessToken({
      userId: user.id,
      email: user.email,
      roles: user.roles,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const validPassword = await this.passwordService.compare(
      dto.password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.tokensService.signAccessToken({
      userId: user.id,
      email: user.email,
      roles: user.roles,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    };
  }
}