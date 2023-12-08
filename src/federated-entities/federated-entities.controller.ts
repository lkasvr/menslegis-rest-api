import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FederatedEntitiesService } from './federated-entities.service';
import { CreateFederatedEntityDto } from './dto/create-federated-entity.dto';
import { UpdateFederatedEntityDto } from './dto/update-federated-entity.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Federated Entity')
@Controller('federated-entities')
export class FederatedEntitiesController {
  constructor(
    private readonly federatedEntitiesService: FederatedEntitiesService,
  ) {}

  @Post()
  async create(
    @Body()
    createFederatedEntityDto: CreateFederatedEntityDto,
  ) {
    return await this.federatedEntitiesService.create(createFederatedEntityDto);
  }

  @Get()
  async findAll() {
    return await this.federatedEntitiesService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.federatedEntitiesService.findOneById(id);
  }

  @ApiBody({
    description: 'Whole or partial Federated Entity to update',
    type: UpdateFederatedEntityDto,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    updateFederatedEntityDto: UpdateFederatedEntityDto,
  ) {
    return await this.federatedEntitiesService.update(
      id,
      updateFederatedEntityDto,
    );
  }

  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.federatedEntitiesService.delete(id);
  }
}
