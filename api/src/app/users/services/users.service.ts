import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  // ✅ required by AuthService
  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  // ✅ rename to avoid confusion with repo.create(...)
  async createUser(email: string, passwordHash: string, roles: string[] = ['user']) {
    const exists = await this.repo.exist({ where: { email } });
    if (exists) throw new ConflictException('Email already registered');
    const user = this.repo.create({ email, passwordHash, roles });
    return this.repo.save(user);
  }

  async updatePasswordHash(userId: string, passwordHash: string) {
    await this.repo.update({ id: userId }, { passwordHash });
  }

  async setRoles(userId: string, roles: string[]) {
    await this.repo.update({ id: userId }, { roles });
  }

  // (Optional) safe list used by UsersController
  async list(q: {
    page: number; limit: number;
    search?: string;
    sort: 'createdAt' | 'email';
    order: 'ASC' | 'DESC';
  }) {
    const where = q.search ? { email: ILike(`%${q.search}%`) } : {};
    const [items, total] = await this.repo.findAndCount({
      where,
      select: ['id', 'email', 'roles', 'createdAt', 'updatedAt'],
      order: { [q.sort]: q.order },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    });
    return { items, page: q.page, limit: q.limit, total, pages: Math.ceil(total / q.limit) };
  }
}
