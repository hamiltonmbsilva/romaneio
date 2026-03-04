import { Body, Controller, Get, Post } from '@nestjs/common'
import { VeiculoService } from './veiculo.service'

@Controller('veiculo')
export class VeiculoController {
  constructor(private veiculoService: VeiculoService) {}

  @Post()
  async create(@Body() body: any) {
    return this.veiculoService.create(body)
  }

  @Get()
  async findAll() {
    return this.veiculoService.findAll()
  }
}
