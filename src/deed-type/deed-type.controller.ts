import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { DeedTypeService } from './deed-type.service';
import { CreateDeedTypeDto } from './dto/create-deed-type.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('deed-type')
export class DeedTypeController {
  constructor(private readonly deedTypeService: DeedTypeService) {}

  @Post()
  async create(@Body() createDeedTypeDto: CreateDeedTypeDto) {
    return await this.deedTypeService.create(createDeedTypeDto);
  }

  @ApiResponse({
    status: 200,
    isArray: true,
  })
  @Get()
  async findAll() {
    return await this.deedTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.deedTypeService.findOneById(id);
  }

  @Put(':id')
  async put(@Param('id') id: string) {
    return await this.deedTypeService.restore(id);
  }

  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deedTypeService.delete(id);
  }
}
