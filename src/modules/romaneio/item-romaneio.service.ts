import { Injectable, Post, Body } from '@nestjs/common'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { AddItemRomaneioDTO } from './dto/add-item-romaneio.dto'

@Injectable()
export class ItemRomaneioService {

  constructor(private prisma: PrismaService) {}

  async remove(id: string) {
    return this.prisma.itemRomaneio.delete({
      where: { id }
    })
  }

  async update(id: string, data: any) {
    return this.prisma.itemRomaneio.update({
      where: { id },
      data
    })
  }

  async adicionarItem(
  romaneioId: string,
  data: AddItemRomaneioDTO
  ) {
    return this.prisma.itemRomaneio.create({
      data: {
        romaneioId,
        clienteId: data.clienteId,
        produtoId: data.produtoId,
        embalagemId: data.embalagemId,
        quantidade: data.quantidade,
        precoUnitario: data.precoUnitario || 0
      }
    })
  }
}