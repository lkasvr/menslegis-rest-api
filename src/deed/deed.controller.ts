import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeedService } from './deed.service';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';

@Controller('deed')
export class DeedController {
  constructor(private readonly deedService: DeedService) {}

  @Post()
  create(@Body() createDeedDto: CreateDeedDto) {
    return this.deedService.create(createDeedDto);
  }

  @Get()
  findAll() {
    return this.deedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeedDto: UpdateDeedDto) {
    return this.deedService.update(+id, updateDeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deedService.remove(+id);
  }
}
