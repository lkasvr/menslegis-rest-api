import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { DeedTypeService } from './deed-type.service';
import { CreateDeedTypeDto } from './dto/create-deed-type.dto';
import { UpdateDeedTypeDto } from './dto/update-deed-type.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('deed-type')
export class DeedTypeController {
  constructor(private readonly deedTypeService: DeedTypeService) {}

  @Post()
  create(@Body() createDeedTypeDto: CreateDeedTypeDto) {
    return this.deedTypeService.create(createDeedTypeDto);
  }

  @Get()
  findAll() {
    return this.deedTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deedTypeService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeedTypeDto: UpdateDeedTypeDto,
  ) {
    return this.deedTypeService.update(id, updateDeedTypeDto);
  }

  @Put(':id')
  put(@Param('id') id: string) {
    return this.deedTypeService.restore(id);
  }

  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.deedTypeService.delete(id);
  }
}
