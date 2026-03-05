import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body
} from '@nestjs/common'

import { ProdutoService } from './produto.service'

import { CreateProdutoDTO } from './dto/create-produto.dto'
import { UpdateProdutoDTO } from './dto/update-produto.dto'

@Controller('produto')
export class ProdutoController {

  constructor(private produtoService: ProdutoService) {}

  @Post()
  create(@Body() body: CreateProdutoDTO) {
    return this.produtoService.create(body)
  }

  @Get()
  findAll() {
    return this.produtoService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtoService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateProdutoDTO
  ) {
    return this.produtoService.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtoService.remove(id)
  }

}