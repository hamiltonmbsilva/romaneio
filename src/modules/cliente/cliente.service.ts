import {
  Injectable,
  BadRequestException,
  NotFoundException
} from '@nestjs/common'

import { PrismaService } from 'src/shared/prisma/prisma.service'

import { CreateClienteDTO } from './dto/create-cliente.dto'
import { UpdateClienteDTO } from './dto/update-cliente.dto'

@Injectable()
export class ClienteService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateClienteDTO) {

    try {

      return await this.prisma.cliente.create({
        data
      })

    } catch (error) {

      if (error.code === 'P2002') {
        throw new BadRequestException('Documento já cadastrado')
      }

      throw error
    }
  }

  async findAll() {
    return this.prisma.cliente.findMany()
  }

  async findOne(id: string) {

    const cliente = await this.prisma.cliente.findUnique({
      where: { id }
    })

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado')
    }

    return cliente
  }

  async update(id: string, data: UpdateClienteDTO) {

    await this.findOne(id)

    return this.prisma.cliente.update({
      where: { id },
      data
    })
  }

  async remove(id: string) {

    await this.findOne(id)

    return this.prisma.cliente.delete({
      where: { id }
    })
  }
}
