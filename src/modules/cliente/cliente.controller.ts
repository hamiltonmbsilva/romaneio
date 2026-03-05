import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body
} from '@nestjs/common'

import { ClienteService } from './cliente.service'

import { CreateClienteDTO } from './dto/create-cliente.dto'
import { UpdateClienteDTO } from './dto/update-cliente.dto'

@Controller('cliente')
export class ClienteController {

  constructor(private clienteService: ClienteService) {}

  @Post()
  create(@Body() body: CreateClienteDTO) {
    return this.clienteService.create(body)
  }

  @Get()
  findAll() {
    return this.clienteService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clienteService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateClienteDTO
  ) {
    return this.clienteService.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clienteService.remove(id)
  }
}
