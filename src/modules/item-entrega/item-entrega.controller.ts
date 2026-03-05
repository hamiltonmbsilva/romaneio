import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common'
import { ItemEntregaService } from './item-entrega.service'
import { CreateItemEntregaDTO } from './dto/create-item-entrega.dto'

@Controller('item-entrega')
export class ItemEntregaController {

  constructor(private readonly service: ItemEntregaService) {}

  @Post()
  create(@Body() data: CreateItemEntregaDTO) {
    return this.service.create(data)
  }

  @Get('/entrega/:id')
  findByEntrega(@Param('id') id: string) {
    return this.service.findByEntrega(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }

}
