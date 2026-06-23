import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [SecurityModule,TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService],
 
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}