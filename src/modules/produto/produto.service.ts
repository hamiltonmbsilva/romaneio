import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/shared/prisma/prisma.service'

import { CreateProdutoDTO } from './dto/create-produto.dto'
import { UpdateProdutoDTO } from './dto/update-produto.dto'

@Injectable()
export class ProdutoService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateProdutoDTO) {
    return this.prisma.produto.create({
      data
    })
  }

  async findAll() {
    return this.prisma.produto.findMany({
      include: {
        embalagens: true
      }
    })
  }

  async findOne(id: string) {

    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: { embalagens: true }
    })

    if (!produto) {
      throw new NotFoundException('Produto não encontrado')
    }

    return produto
  }

  async update(id: string, data: UpdateProdutoDTO) {

    await this.findOne(id)

    return this.prisma.produto.update({
      where: { id },
      data
    })
  }

  async remove(id: string) {

    await this.findOne(id)

    return this.prisma.produto.delete({
      where: { id }
    })
  }

}