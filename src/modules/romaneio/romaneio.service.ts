import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/prisma/prisma.service'
import { CreateRomaneioDTO } from './dto/create-romaneio.dto'
import { NotFoundException } from '@nestjs/common'

@Injectable()
export class RomaneioService {

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRomaneioDTO) {

  console.log("DTO RECEBIDO:", dto)

  if (!dto.motoristaId || !dto.veiculoId) {
    throw new Error("Motorista e veículo são obrigatórios")
  }

  const ultimo = await this.prisma.romaneio.findFirst({
    orderBy: { numero: "desc" }
  })

  const numero = ultimo ? ultimo.numero + 1 : 1

  const data = dto.dataSaida ? new Date(dto.dataSaida) : new Date()

  if (isNaN(data.getTime())) {
    throw new Error("Data inválida")
  } 
  

  return this.prisma.romaneio.create({
    data: {

      numero, 
      rota: dto.rota ?? null, 
      
      motoristaId: dto.motoristaId,
      veiculoId: dto.veiculoId,
      dataSaida: data,
      status: "ABERTO"
    }
  })
}

  async listar() {
  return this.prisma.romaneio.findMany({
    include: {
      motorista: true,
      veiculo: true
    },
    orderBy: {
      createdAt: "desc"
    }
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

  async adicionarItem(
    romaneioId: string,
    data: {
      clienteId: string
      produtoId: string
      embalagemId: string
      quantidade: number
      }
    ) {

    return this.prisma.itemRomaneio.create({
      data: {
        romaneioId,
        clienteId: data.clienteId,
        produtoId: data.produtoId,
        embalagemId: data.embalagemId,
        quantidade: data.quantidade
      }
    })

  }

  async findOne(id: string) {
    return this.prisma.romaneio.findUnique({
      where: { id },
      include: {
        motorista: true,
        veiculo: true,

        itensRomaneio: {
          include: {
            cliente: true,
            produto: true,
            embalagem: true
          }
        }
      }
    })
  }

  async buscarOrganizado(id: string) {

    const romaneio = await this.findOne(id) 

    if (!romaneio) {
      throw new NotFoundException("Romaneio não encontrado")
    }

    const agrupado: any = {}

    for (const item of romaneio.itensRomaneio) {

      const clienteId = item.clienteId

      if (!agrupado[clienteId]) {
        agrupado[clienteId] = {
          cliente: item.cliente,
          itens: []
        }
      }

      agrupado[clienteId].itens.push(item)
    }

    return {
      ...romaneio,
      clientes: Object.values(agrupado)
    }
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