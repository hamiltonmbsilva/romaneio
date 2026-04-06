import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../shared/prisma/prisma.service'
import { CreateRomaneioDTO } from './dto/create-romaneio.dto'

@Injectable()
export class RomaneioService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRomaneioDTO) {
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
        dataSaida: new Date(data),
        status: "AGUARDANDO"
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
      precoUnitario: number
    }
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

  async update(id: string, data: any) {
    return this.prisma.itemRomaneio.update({
      where: { id },
      data
    })
  }

  async calcularPesoRomaneio(romaneioId: string) {
    const itens = await this.prisma.itemRomaneio.findMany({
      where: {
        romaneioId
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

  async iniciarRomaneio(id: string) {
    const romaneio = await this.prisma.romaneio.findUnique({
      where: { id },
      include: {
        veiculo: true
      }
    })

    if (!romaneio) {
      throw new NotFoundException("Romaneio não encontrado")
    }

    if (romaneio.status === "EM_ENTREGA") {
      throw new Error("Romaneio já foi iniciado")
    }

    if (romaneio.status === "FINALIZADO") {
      throw new Error("Romaneio já foi finalizado")
    }

    const ultimoHistorico = await this.prisma.veiculoKm.findFirst({
      where: {
        veiculoId: romaneio.veiculoId
      },
      orderBy: {
        dataSaida: "desc"
      }
    })

    const kmSaida = ultimoHistorico?.kmRetorno ?? Math.round(romaneio.veiculo.kmInicial)

    const romaneioAtualizado = await this.prisma.romaneio.update({
      where: { id },
      data: {
        status: "EM_ENTREGA",
        dataInicio: new Date(),
        kmSaida
      }
    })

    await this.prisma.veiculoKm.create({
      data: {
        veiculoId: romaneio.veiculoId,
        romaneioId: romaneio.id,
        kmSaida,
        dataSaida: new Date()
      }
    })

    return romaneioAtualizado
  }

  async finalizarRomaneio(id: string, kmRetorno: number) {
    const romaneio = await this.prisma.romaneio.findUnique({
      where: { id },
      include: {
        veiculo: true
      }
    })

    if (!romaneio) {
      throw new NotFoundException('Romaneio não encontrado')
    }

    if (romaneio.status !== 'EM_ENTREGA') {
      throw new Error('Só é possível finalizar romaneio em entrega')
    }

    if (romaneio.veiculo.kmInicial == null) {
      throw new Error('Romaneio sem KM de saída')
    }

    if (kmRetorno < romaneio.veiculo.kmInicial) {
      throw new Error('KM de retorno não pode ser menor que KM de saída')
    }

    const kmRodado = kmRetorno - romaneio.veiculo.kmInicial

    const historicoAberto = await this.prisma.veiculoKm.findFirst({
      where: {
        romaneioId: romaneio.id,
        veiculoId: romaneio.veiculoId,
        kmRetorno: null
      },
      orderBy: {
        dataSaida: 'desc'
      }
    })

    if (!historicoAberto) {
      throw new Error('Histórico de KM aberto não encontrado para esse romaneio')
    }

    await this.prisma.veiculoKm.update({
      where: { id: historicoAberto.id },
      data: {
        kmRetorno: Math.round(kmRetorno),
        kmRodado: Math.round(kmRodado),
        dataRetorno: new Date()
      }
    })

    const romaneioAtualizado = await this.prisma.romaneio.update({
      where: { id },
      data: {
        status: 'FINALIZADO',
        kmRetorno,
        dataFim: new Date()
      }
    })

    await this.prisma.veiculo.update({
      where: { id: romaneio.veiculoId },
      data: {
        kmFinal: kmRetorno
      }
    })

    return {
      message: 'Romaneio finalizado com sucesso',
      kmRodado,
      romaneio: romaneioAtualizado
    }
  }
  
}