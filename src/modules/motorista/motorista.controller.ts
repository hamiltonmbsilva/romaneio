import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Patch
} from '@nestjs/common'
import { MotoristaService } from './motorista.service'
import { CreateMotoristaDTO } from './dto/create-motorista.dto'
import { UpdateMotoristaDTO } from './dto/update-motorista.dto'

@Controller('motorista')
export class MotoristaController {
  constructor(private readonly motoristaService: MotoristaService) {}

  @Post()
  create(@Body() body: CreateMotoristaDTO) {
    console.log("Bateu no controlher", body)
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

  @Patch(":id")
  atualizar(@Param("id") id: string, @Body() body: any) {
    console.log("🔥 PATCH OK:", id)
    return this.motoristaService.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.motoristaService.remove(id)
  }
}
