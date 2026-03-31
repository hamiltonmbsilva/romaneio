import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { RomaneioService } from './romaneio.service'
import { CreateRomaneioDTO } from './dto/create-romaneio.dto'

@Controller('romaneio')
export class RomaneioController {

  constructor(private readonly romaneioService: RomaneioService) {}

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

}
