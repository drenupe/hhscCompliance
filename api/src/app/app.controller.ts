// api/src/app/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET /api/v1
  @Get()
  getRoot() {
    return this.appService.root();
  }

  // GET /api/v1/health
  @Get('health')
  getHealth() {
    return this.appService.health();
  }
}
