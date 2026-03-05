import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/prisma/prisma.service'
import { CreateItemEntregaDTO } from './dto/create-item-entrega.dto'

@Injectable()
export class ItemEntregaService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateItemEntregaDTO) {

    return this.prisma.itemEntrega.create({
      data
    })

  }

  async findByEntrega(entregaId: string) {

    return this.prisma.itemEntrega.findMany({
      where: { entregaId },
      include: {
        produto: true,
        embalagem: true
      }
    })

  }

  async remove(id: string) {

    return this.prisma.itemEntrega.delete({
      where: { id }
    })

  }

}
