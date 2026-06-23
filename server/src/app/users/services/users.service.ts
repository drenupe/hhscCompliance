import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}


  async findSafeById(id: string): Promise<Omit<UserEntity, 'passwordHash'>> {
  const user = await this.getById(id);
  return this.toSafeUser(user);
}
  async findAll(): Promise<Omit<UserEntity, 'passwordHash'>[]> {
    const users = await this.usersRepo.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return users.map((user) => this.toSafeUser(user));
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.usersRepo.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepo.findOne({
      where: {
        email: email.toLowerCase().trim(),
      },
    });
  }

  async getById(id: string): Promise<UserEntity> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(params: {
    email: string;
    passwordHash: string;
    roles?: string[];
  }): Promise<UserEntity> {
    const user = this.usersRepo.create({
      email: params.email.toLowerCase().trim(),
      passwordHash: params.passwordHash,
      roles: params.roles ?? [],
    });

    return this.usersRepo.save(user);
  }

  async updateRoles(
    id: string,
    roles: string[],
  ): Promise<Omit<UserEntity, 'passwordHash'>> {
    const user = await this.getById(id);

    user.roles = roles ?? [];

    const saved = await this.usersRepo.save(user);

    return this.toSafeUser(saved);
  }

  private toSafeUser(user: UserEntity): Omit<UserEntity, 'passwordHash'> {
    const { passwordHash: _passwordHash, ...safeUser } = user;

    return safeUser;
  }
}