import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { DeedSubtypeService } from './deed-subtype.service';
import { CreateDeedSubtypeDto } from './dto/create-deed-subtype.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('deed-subtype')
export class DeedSubtypeController {
  constructor(private readonly deedSubtypeService: DeedSubtypeService) {}

  @Post()
  create(@Body() createDeedSubtypeDto: CreateDeedSubtypeDto) {
    return this.deedSubtypeService.create(createDeedSubtypeDto);
  }

  @Get()
  findAll() {
    return this.deedSubtypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deedSubtypeService.findOneById(id);
  }

  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deedSubtypeService.delete(id);
  }
}
