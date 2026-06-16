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
}