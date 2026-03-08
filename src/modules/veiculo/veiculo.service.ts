import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { CreateVeiculoDTO } from './dto/create-veiculo.dto'
import { UpdateVeiculoDTO } from '../veiculo/dto/update-veiculo.dto'

@Injectable()
export class VeiculoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVeiculoDTO) {
    const placaExiste = await this.prisma.veiculo.findUnique({
      where: { placa: data.placa },
    })

    if (placaExiste) {
      throw new BadRequestException('Já existe veículo com essa placa')
    }

    return this.prisma.veiculo.create({ data })
  }

  async findAll() {
    return this.prisma.veiculo.findMany()
  }

  async findOne(id: string) {
    const veiculo = await this.prisma.veiculo.findUnique({
      where: { id },
    })

    if (!veiculo) {
      throw new NotFoundException('Veículo não encontrado')
    }

    return veiculo
  }

  async update(id: string, data: UpdateVeiculoDTO) {
    await this.findOne(id)

    return this.prisma.veiculo.update({
      where: { id },
      data,
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.veiculo.delete({
      where: { id },
    })
  }

  async alterarStatus(id: string) {

    const veiculo = await this.findOne(id)

    return this.prisma.veiculo.update({
      where:{ id },
      data:{
        ativo: !veiculo.ativo
      }
    })

  }
}
