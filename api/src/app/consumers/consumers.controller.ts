/* eslint-disable @nx/enforce-module-boundaries */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ConsumersService } from './consumers.service';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { UpdateConsumerDto } from './dto/update-consumer.dto';
import { Consumer } from './entities/consumer.entity';

@Controller({
  path: 'consumers',
  version: '1',
})
export class ConsumersController {
  constructor(private readonly consumersService: ConsumersService) {}

  /**
   * POST /api/v1/consumers
   * Create a new consumer associated to an ISS provider.
   */
  @Post()
  create(@Body() dto: CreateConsumerDto): Promise<Consumer> {
    return this.consumersService.create(dto);
  }

  /**
   * GET /api/v1/consumers
   * Optional: ?issProviderId=1 to filter by provider.
   */
  @Get()
  findAll(
    @Query('issProviderId') issProviderId?: string,
  ): Promise<Consumer[]> {
    if (issProviderId) {
      return this.consumersService.findByProvider(Number(issProviderId));
    }
    return this.consumersService.findAll();
  }

  /**
   * GET /api/v1/consumers/:id
   * Fetch a single consumer by id.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Consumer> {
    return this.consumersService.findOne(id);
  }

  /**
   * PATCH /api/v1/consumers/:id
   * Update consumer demographics / metadata.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConsumerDto,
  ): Promise<Consumer> {
    return this.consumersService.update(id, dto);
  }
}
