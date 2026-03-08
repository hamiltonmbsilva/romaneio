import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Param, 
  Put, 
  Delete 
} from '@nestjs/common'
import { VeiculoService } from './veiculo.service'
import { CreateVeiculoDTO } from './dto/create-veiculo.dto'
import { UpdateVeiculoDTO } from './dto/update-veiculo.dto'

@Controller('veiculo')
export class VeiculoController {
  constructor(private veiculoService: VeiculoService) {}

  @Post()
  create(@Body() body: CreateVeiculoDTO) {
    return this.veiculoService.create(body)
  }

  @Get()
  findAll() {
    return this.veiculoService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.veiculoService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateVeiculoDTO,
  ) {
    return this.veiculoService.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.veiculoService.remove(id)
  }

  @Put(':id/status')
  alterarStatus(@Param('id') id:string){
    return this.veiculoService.alterarStatus(id)
  }
}
