import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/prisma/prisma.service'

interface CreateVeiculoDTO {
  placa: string
  modelo: string
  ano: number
  kmInicial: number
  capacidadeKg: number
}

@Injectable()
export class VeiculoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVeiculoDTO) {
    return this.prisma.veiculo.create({
      data,
    })
  }

  async findAll() {
    return this.prisma.veiculo.findMany()
  }
}
