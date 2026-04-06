import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { RomaneioService } from './romaneio.service'
import { CreateRomaneioDTO } from './dto/create-romaneio.dto'
import { ItemRomaneioService } from './item-romaneio.service'
import { FinalizarRomaneioDTO } from './dto/finalizar-romaneio.dto'

@Controller('romaneio')
export class RomaneioController {
  constructor(
    private readonly romaneioService: RomaneioService,
    private readonly itemRomaneioService: ItemRomaneioService
  ) {}

  @Post()
  create(@Body() dto: CreateRomaneioDTO) {
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

  @Post(':id/adicionar-item')
  adicionarItem(
    @Param('id') romaneioId: string,
    @Body() body: {
      clienteId: string
      produtoId: string
      embalagemId: string
      quantidade: number
      precoUnitario: number
      numeroNF?: string
    }
  ) {
    return this.romaneioService.adicionarItem(romaneioId, body)
  }

  @Post(':id/iniciar')
  iniciar(@Param('id') id: string) {
    return this.romaneioService.iniciarRomaneio(id)
  }

  @Post(':id/finalizar')
  finalizar(
    @Param('id') id: string,
    @Body() body: FinalizarRomaneioDTO
  ) {
    return this.romaneioService.finalizarRomaneio(id, body.kmRetorno)
  }

  @Post(':id/calcular-rota')
  calcularRota(@Param('id') id: string) {
    return this.romaneioService.calcularRotaRomaneio(id)
  }

  @Get(':id/rota')
  buscarRota(@Param('id') id: string) {
    return this.romaneioService.buscarRotaRomaneio(id)
  }

  @Get(':id/entregas')
  listarEntregas(@Param('id') id: string) {
    return this.romaneioService.listarEntregasDoRomaneio(id)
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
