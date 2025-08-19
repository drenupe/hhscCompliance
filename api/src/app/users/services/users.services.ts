// api/src/app/users/users.service.ts
import { Injectable } from '@nestjs/common';
@Injectable()
export class UsersService {
  async findByEmail(_email: string) { return null; }
  async create(_dto: any) { return { id: 'user-1' }; }
}