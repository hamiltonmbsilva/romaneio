import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'
import { EntregaService } from './entrega.service'
import { CreateEntregaDTO } from './dto/create-entrega.dto'
import { UpdateEntregaDTO } from './dto/update-entrega.dto'

@Controller('entrega')
export class EntregaController {

  constructor(private readonly entregaService: EntregaService) {}

  @Post()
  create(@Body() data: CreateEntregaDTO) {
    return this.entregaService.create(data)
  }

  @Get()
  findAll() {
    return this.entregaService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entregaService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateEntregaDTO) {
    return this.entregaService.update(id, data)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entregaService.remove(id)
  }

}
