import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { RomaneioService } from './romaneio.service'
import { CreateRomaneioDTO } from './dto/create-romaneio.dto'

@Controller('romaneio')
export class RomaneioController {

  constructor(private readonly romaneioService: RomaneioService) {}

  @Post()
  create(@Body() data: CreateRomaneioDTO) {
    return this.romaneioService.create(data)
  }

  @Get()
  findAll() {
    return this.romaneioService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.romaneioService.findOne(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.romaneioService.remove(id)
  }

}
