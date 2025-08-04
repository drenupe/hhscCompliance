import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../config/typeorm.config';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([User]),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
