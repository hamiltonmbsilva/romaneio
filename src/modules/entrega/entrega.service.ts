import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../shared/prisma/prisma.service'
import { CreateEntregaDTO } from './dto/create-entrega.dto'
import { UpdateEntregaDTO } from './dto/update-entrega.dto'

@Injectable()
export class EntregaService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateEntregaDTO) {
    return this.prisma.entrega.create({
      data
    })
  }

  async findAll() {
    return this.prisma.entrega.findMany({
      include: {
        cliente: true,
        romaneio: true
      }
    })
  }

  async findOne(id: string) {

    const entrega = await this.prisma.entrega.findUnique({
      where: { id },
      include: {
        cliente: true,
        itens: {
          include: {
            produto: true,
            embalagem: true
          }
        }
      }
    })

    if (!entrega) {
      throw new NotFoundException('Entrega não encontrada')
    }

    return entrega
  }

  async update(id: string, data: UpdateEntregaDTO) {

    await this.findOne(id)

    return this.prisma.entrega.update({
      where: { id },
      data
    })
  }

  async remove(id: string) {

    await this.findOne(id)

    return this.prisma.entrega.delete({
      where: { id }
    })
  }

}
