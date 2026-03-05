import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body
} from '@nestjs/common'

import { EmbalagemService } from './embalagem.service'

import { CreateEmbalagemDTO } from './dto/create-embalagem.dto'
import { UpdateEmbalagemDTO } from './dto/update-embalagem.dto'

@Controller('embalagem')
export class EmbalagemController {

  constructor(private embalagemService: EmbalagemService) {}

  @Post()
  create(@Body() body: CreateEmbalagemDTO) {
    return this.embalagemService.create(body)
  }

  @Get()
  findAll() {
    return this.embalagemService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.embalagemService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateEmbalagemDTO
  ) {
    return this.embalagemService.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.embalagemService.remove(id)
  }

}