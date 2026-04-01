import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { RomaneioService } from './romaneio.service'
import { CreateRomaneioDTO } from './dto/create-romaneio.dto'
import { ItemRomaneioService } from './item-romaneio.service'

@Controller('romaneio')
export class RomaneioController {

  constructor(private readonly romaneioService: RomaneioService , 
              private readonly itemRomaneioService : ItemRomaneioService) {}

  @Post()
  create(@Body() dto: CreateRomaneioDTO) {
      console.log("🔥 BATEU NO CREATE ROMANEIO", dto)
    return this.romaneioService.create(dto)
  }

  @Get()
  listar() {
    return this.romaneioService.listar()
  }

  @Get(':id/peso')
  
  calcularPeso(@Param('id') id: string) {
    console.log("Bateu no controller calcular peso", id)
    return this.romaneioService.ocupacaoVeiculo(id)
  }
  
  @Get(':id/peso')
    getPeso(@Param('id') id: string) {
      console.log("Bateu no controller getpeso", id)
      return this.romaneioService.ocupacaoVeiculo(id)
    }

  @Post(":id/adicionar-item")
    adicionarItem(
      @Param("id") romaneioId: string,
      @Body() body: {
        clienteId: string
        produtoId: string
        embalagemId: string
        quantidade: number
      }
    ) {
      return this.romaneioService.adicionarItem(romaneioId, body)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.romaneioService.findOne(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.romaneioService.remove(id)
  }

  @Put(':id')
    update(
      @Param('id') id: string,
      @Body() body: any
    ) {
      return this.itemRomaneioService.update(id, body)
    }

}
