import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { DeedService } from './deed.service';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('deed')
export class DeedController {
  constructor(private readonly deedService: DeedService) {}

  @Post()
  async create(@Body() createDeedDto: CreateDeedDto) {
    return await this.deedService.create(createDeedDto);
  }

  @Get()
  async findAll() {
    return await this.deedService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.deedService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeedDto: UpdateDeedDto) {
    return this.deedService.update(id, updateDeedDto);
  }

  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deedService.delete(id);
  }
}
