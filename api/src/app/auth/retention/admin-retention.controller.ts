import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { RetentionService } from './retention.service';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';


@Controller('admin/retention')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminRetentionController {
  constructor(private readonly retention: RetentionService) {}

  @Get('status')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  status() {
    return this.retention.getStatus();
  }

  @Post('run')
  @Roles('admin')
  @HttpCode(HttpStatus.ACCEPTED)
  async runNow() {
    return this.retention.runAll();
  }
}
