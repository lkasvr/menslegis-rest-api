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
  create(@Body() createPoliticalBodyDto: CreatePoliticalBodyDto) {
    return this.politicalBodyService.create(createPoliticalBodyDto);
  }

  @Get()
  findAll() {
    return this.politicalBodyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.politicalBodyService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePoliticalBodyDto: UpdatePoliticalBodyDto,
  ) {
    return this.politicalBodyService.update(id, updatePoliticalBodyDto);
  }

  @Put(':id')
  put(@Param('id') id: string) {
    return this.politicalBodyService.restore(id);
  }

  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.politicalBodyService.delete(id);
  }
}
