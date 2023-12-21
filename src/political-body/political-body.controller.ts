import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  Put,
} from '@nestjs/common';
import { PoliticalBodyService } from './political-body.service';
import { CreatePoliticalBodyDto } from './dto/create-political-body.dto';
import { UpdatePoliticalBodyDto } from './dto/update-political-body.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('political-body')
export class PoliticalBodyController {
  constructor(private readonly politicalBodyService: PoliticalBodyService) {}

  @Post()
  async create(@Body() createPoliticalBodyDto: CreatePoliticalBodyDto) {
    return await this.politicalBodyService.create(createPoliticalBodyDto);
  }

  @Get()
  async findAll() {
    return await this.politicalBodyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.politicalBodyService.findOneById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePoliticalBodyDto: UpdatePoliticalBodyDto,
  ) {
    return await this.politicalBodyService.update(id, updatePoliticalBodyDto);
  }

  @Put(':id')
  async put(@Param('id') id: string) {
    return await this.politicalBodyService.restore(id);
  }

  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.politicalBodyService.delete(id);
  }
}
