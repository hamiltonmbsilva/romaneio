import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/prisma/prisma.service'
import { CreateRomaneioDTO } from './dto/create-romaneio.dto'
import { NotFoundException } from '@nestjs/common'

@Injectable()
export class RomaneioService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateRomaneioDTO) {
    return this.prisma.romaneio.create({
      data
    })
  }

  async findAll() {
    return this.prisma.romaneio.findMany({
      include: {
        motorista: true,
        veiculo: true
      }
    })
  }

  async findOne(id: string) {
    return this.prisma.romaneio.findUnique({
      where: { id },
      include: {
        entregas: {
          include: {
            cliente: true,
            itens: {
              include: {
                produto: true,
                embalagem: true
              }
            }
          }
        }
      }
    })
  }

  async remove(id: string) {
    return this.prisma.romaneio.delete({
      where: { id }
    })
  }

  async calcularPesoRomaneio(romaneioId: string) {

  const itens = await this.prisma.itemEntrega.findMany({
    where: {
      entrega: {
        romaneioId
      }
    },
    include: {
      embalagem: true
    }
  })

  let pesoTotal = 0

  for (const item of itens) {

    const pesoItem = item.embalagem.pesoUnitarioKg * item.quantidade

    pesoTotal += pesoItem

  }

  return pesoTotal
}


async ocupacaoVeiculo(romaneioId: string) {

  const romaneio = await this.prisma.romaneio.findUnique({
    where: { id: romaneioId },
    include: {
      veiculo: true
    }
  })

  if (!romaneio) {
    throw new NotFoundException('Romaneio não encontrado')
  }

  const pesoTotal = await this.calcularPesoRomaneio(romaneioId)

  const capacidade = romaneio.veiculo.capacidadeKg

  const ocupacao = (pesoTotal / capacidade) * 100

  return {
    pesoTotal,
    capacidade,
    ocupacao
  }

}

}