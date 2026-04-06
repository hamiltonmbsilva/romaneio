import { Injectable, Post, Body, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { AddItemRomaneioDTO } from './dto/add-item-romaneio.dto'

@Injectable()
export class ItemRomaneioService {

  constructor(private prisma: PrismaService) {}

  async remove(id: string) {
    const item = await this.prisma.itemRomaneio.findUnique({
      where: { id },
      include: {
        romaneio: true
      }
    })

    if (!item) {
      throw new Error("Item do romaneio não encontrado")
    }

    if (item.romaneio.status === "FINALIZADO") {
      throw new Error("Não é possível excluir item de romaneio finalizado")
    }

    return this.prisma.itemRomaneio.delete({
      where: { id }
    })
  }

  async update(id: string, data: any) {
    const item = await this.prisma.itemRomaneio.findUnique({
      where: { id },
      include: {
        romaneio: true
      }
    })

    if (!item) {
      throw new Error("Item do romaneio não encontrado")
    }

    if (item.romaneio.status === "FINALIZADO") {
      throw new Error("Não é possível editar item de romaneio finalizado")
    }

    return this.prisma.itemRomaneio.update({
      where: { id },
      data
    })
  }

  async atualizarStatus(id: string, status: string) {
    const item = await this.prisma.itemRomaneio.findUnique({
      where: { id },
      include: {
        romaneio: true
      }
    })

    if (!item) {
      throw new Error("Item do romaneio não encontrado")
    }

    if (item.romaneio.status === "FINALIZADO") {
      throw new Error("Romaneio finalizado não permite alterar status")
  }

  return this.prisma.itemRomaneio.update({
    where: { id },
    data: {
      status
    }
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