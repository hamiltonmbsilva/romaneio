import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common'
import { MotoristaService } from './motorista.service'
import { CreateMotoristaDTO } from './dto/create-motorista.dto'
import { UpdateMotoristaDTO } from './dto/update-motorista.dto'

@Controller('motorista')
export class MotoristaController {
  constructor(private readonly motoristaService: MotoristaService) {}

  @Post()
  create(@Body() body: CreateMotoristaDTO) {
    return this.motoristaService.create(body)
  }

  @Get()
  findAll() {
    return this.motoristaService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.motoristaService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateMotoristaDTO,
  ) {
    return this.motoristaService.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.motoristaService.remove(id)
  }
}
