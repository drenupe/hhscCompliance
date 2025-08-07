import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { User } from '../users/entities/user.entity';
import { typeOrmConfig } from '../configuration/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([User]),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
