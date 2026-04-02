import { Controller, Delete, Param, Put, Body, Post } from '@nestjs/common'
import { ItemRomaneioService } from './item-romaneio.service'
import { AddItemRomaneioDTO } from './dto/add-item-romaneio.dto'

@Controller('item-romaneio')
export class ItemRomaneioController {

  constructor(private readonly itemRomaneioService: ItemRomaneioService) {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemRomaneioService.remove(id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.itemRomaneioService.update(id, body)
  }

  @Post()
  adicionarItem(@Body() body: AddItemRomaneioDTO) {
    return this.itemRomaneioService.adicionarItem(body.romaneioId, body)
  }
}