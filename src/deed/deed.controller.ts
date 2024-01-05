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
  Query,
} from '@nestjs/common';
import { DeedService } from './deed.service';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { ApiResponse } from '@nestjs/swagger';
import { DeedPayloadDto } from './dto/create-deed-payload.dto';

@Controller('deed')
export class DeedController {
  constructor(private readonly deedService: DeedService) {}

  @Post()
  async create(@Body() createDeedDto: CreateDeedDto) {
    return await this.deedService.create(createDeedDto);
  }

  @Get()
  async findAll(
    @Query('year') year?: string,
    @Query('date') date?: string,
    @Query('initialDate') initialDate?: string,
    @Query('finalDate') finalDate?: string,
  ) {
    return await this.deedService.findAll({ year, date, initialDate, finalDate });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.deedService.findOneById(id);
  }

  @Put()
  async receiveDeedPayload(@Body() deedPayloadDto: DeedPayloadDto) {
    return await this.deedService.receiveDeedPayload(deedPayloadDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDeedDto: UpdateDeedDto) {
    return await this.deedService.update(id, updateDeedDto);
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
