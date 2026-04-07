import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../shared/prisma/prisma.service'
import { CreateRomaneioDTO } from './dto/create-romaneio.dto'
import { GeocodingService } from '../../shared/services/geocoding.service'

@Injectable()
export class RomaneioService {
  constructor(private prisma: PrismaService,
    private geocodingService: GeocodingService
  ) {}

  async create(dto: CreateRomaneioDTO) {
    if (!dto.motoristaId || !dto.veiculoId) {
      throw new Error('Motorista e veículo são obrigatórios')
    }

    const ultimo = await this.prisma.romaneio.findFirst({
      orderBy: { numero: 'desc' }
    })

    const numero = ultimo ? ultimo.numero + 1 : 1

    const data = dto.dataSaida ? new Date(dto.dataSaida) : new Date()

    if (isNaN(data.getTime())) {
      throw new Error('Data inválida')
    }

    return this.prisma.romaneio.create({
      data: {
        numero,
        rota: dto.rota ?? null,
        motoristaId: dto.motoristaId,
        veiculoId: dto.veiculoId,
        dataSaida: new Date(data),
        status: 'AGUARDANDO'
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
        createdAt: 'desc'
      }
    })
  }

  async findAll() {
    return this.prisma.romaneio.findMany({
      include: {
        motorista: true,
        veiculo: true
      },
      orderBy: {
        createdAt: 'desc'
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
      numeroNF?: string
    }
  ) {
    const romaneio = await this.prisma.romaneio.findUnique({
      where: { id: romaneioId }
    })

    if (!romaneio) {
      throw new NotFoundException('Romaneio não encontrado')
    }

    if (romaneio.status === 'FINALIZADO') {
      throw new Error('Não é possível adicionar item em romaneio finalizado')
    }

    return this.prisma.itemRomaneio.create({
      data: {
        romaneioId,
        clienteId: data.clienteId,
        produtoId: data.produtoId,
        embalagemId: data.embalagemId,
        quantidade: data.quantidade,
        precoUnitario: data.precoUnitario || 0,
        numeroNF: data.numeroNF || null
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
      throw new NotFoundException('Romaneio não encontrado')
    }

    const agrupado: Record<
      string,
      {
        cliente: any
        itens: any[]
      }
    > = {}

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

  async listarEntregasDoRomaneio(id: string) {
    const romaneio = await this.prisma.romaneio.findUnique({
      where: { id },
      include: {
        motorista: true,
        veiculo: true,
        itensRomaneio: {
          include: {
            cliente: true,
            produto: true,
            embalagem: true
          },
          orderBy: {
            ordemEntrega: 'asc'
          }
        }
      }
    })

    if (!romaneio) {
      throw new NotFoundException('Romaneio não encontrado')
    }

    const agrupado: Record<
      string,
      {
        clienteId: string
        cliente: any
        status: string
        numeroNF: string | null
        ordemEntrega: number | null
        itens: any[]
        totalCliente: number
        pesoCliente: number
      }
    > = {}

    for (const item of romaneio.itensRomaneio) {
      if (!agrupado[item.clienteId]) {
        agrupado[item.clienteId] = {
          clienteId: item.clienteId,
          cliente: item.cliente,
          status: item.status || 'PENDENTE',
          numeroNF: item.numeroNF || null,
          ordemEntrega: item.ordemEntrega ?? null,
          itens: [],
          totalCliente: 0,
          pesoCliente: 0
        }
      }

      const totalItem = item.quantidade * (item.precoUnitario || 0)
      const pesoItem = item.quantidade * (item.embalagem?.pesoUnitarioKg || 0)

      agrupado[item.clienteId].itens.push(item)
      agrupado[item.clienteId].totalCliente += totalItem
      agrupado[item.clienteId].pesoCliente += pesoItem
    }

    const entregasOrdenadas = Object.values(agrupado).sort((a, b) => {
      const ordemA = a.ordemEntrega ?? 9999
      const ordemB = b.ordemEntrega ?? 9999
      return ordemA - ordemB
    })

    return {
      romaneio: {
        id: romaneio.id,
        numero: romaneio.numero,
        status: romaneio.status,
        motorista: romaneio.motorista,
        veiculo: romaneio.veiculo,
        kmSaida: romaneio.kmSaida,
        kmRetorno: romaneio.kmRetorno,
        dataSaida: romaneio.dataSaida,
        dataInicio: romaneio.dataInicio,
        dataFim: romaneio.dataFim
      },
      entregas: entregasOrdenadas
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
      throw new NotFoundException('Romaneio não encontrado')
    }

    if (romaneio.status === 'EM_ENTREGA') {
      throw new Error('Romaneio já foi iniciado')
    }

    if (romaneio.status === 'FINALIZADO') {
      throw new Error('Romaneio já foi finalizado')
    }

    const ultimoHistorico = await this.prisma.veiculoKm.findFirst({
      where: {
        veiculoId: romaneio.veiculoId
      },
      orderBy: {
        dataSaida: 'desc'
      }
    })

    const kmSaida =
      ultimoHistorico?.kmRetorno ?? Math.round(romaneio.veiculo.kmInicial)

    const romaneioAtualizado = await this.prisma.romaneio.update({
      where: { id },
      data: {
        status: 'EM_ENTREGA',
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

    if (romaneio.kmSaida == null) {
      throw new Error('Romaneio sem KM de saída')
    }

    if (kmRetorno < romaneio.kmSaida) {
      throw new Error('KM de retorno não pode ser menor que KM de saída')
    }

    const kmRodado = kmRetorno - romaneio.kmSaida

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

  private obterRegiaoBase(cliente: any) {
    if (cliente?.cidade && cliente.cidade.trim()) return cliente.cidade.trim()
    if (cliente?.bairro && cliente.bairro.trim()) return cliente.bairro.trim()
    return 'Sem região'
  }

  async calcularRotaRomaneio(id: string) {
    const romaneio = await this.prisma.romaneio.findUnique({
      where: { id },
      include: {
        itensRomaneio: {
          include: {
            cliente: true,
            embalagem: true
          }
        }
      }
    })

    if (!romaneio) {
      throw new NotFoundException('Romaneio não encontrado')
    }

    if (romaneio.status === 'FINALIZADO') {
      throw new Error('Não é possível calcular rota para romaneio finalizado')
    }

    if (!romaneio.itensRomaneio.length) {
      throw new Error('Adicione itens ao romaneio antes de calcular a rota')
    }

    const clientesMap = new Map<
      string,
      {
        clienteId: string
        cliente: any
        totalPeso: number
        totalValor: number
        quantidadeItens: number
      }
    >()

    for (const item of romaneio.itensRomaneio) {
      const pesoItem = item.quantidade * (item.embalagem?.pesoUnitarioKg || 0)
      const valorItem = item.quantidade * (item.precoUnitario || 0)

      if (!clientesMap.has(item.clienteId)) {
        clientesMap.set(item.clienteId, {
          clienteId: item.clienteId,
          cliente: item.cliente,
          totalPeso: 0,
          totalValor: 0,
          quantidadeItens: 0
        })
      }

      const atual = clientesMap.get(item.clienteId)!
      atual.totalPeso += pesoItem
      atual.totalValor += valorItem
      atual.quantidadeItens += 1
    }

    const clientesUnicos = Array.from(clientesMap.values())

    const clientesValidos: Array<{
      clienteId: string
      nomeFantasia: string
      cidade: string
      bairro: string
      endereco: string
      regiao: string
      latitude: number
      longitude: number
      totalPeso: number
      totalValor: number
      quantidadeItens: number
    }> = []

    const clientesPendentes: Array<{
      clienteId: string
      nomeFantasia: string
      cidade: string
      bairro: string
      endereco: string
      regiao: string
      motivo: string
    }> = []

    for (const registro of clientesUnicos) {
      const cliente = registro.cliente
      const regiao = this.obterRegiaoBase(cliente)

      const resultado = await this.geocodingService.garantirCoordenadasCliente({
        id: cliente.id,
        nomeFantasia: cliente.nomeFantasia,
        endereco: cliente.endereco,
        bairro: cliente.bairro,
        cidade: cliente.cidade,
        estado: cliente.estado,
        latitude: cliente.latitude,
        longitude: cliente.longitude
      })

      if (!resultado.ok) {
        clientesPendentes.push({
          clienteId: cliente.id,
          nomeFantasia: cliente.nomeFantasia || 'Cliente sem nome',
          cidade: cliente.cidade || '',
          bairro: cliente.bairro || '',
          endereco: cliente.endereco || '',
          regiao,
          motivo: `${resultado.motivo}. Busca usada: ${resultado.enderecoCompleto || 'não informado'}`
        })
        continue
      }

      console.log(
        `[ROTA][GEOCODING] Cliente: ${cliente.nomeFantasia || cliente.id} | Tentativa usada: ${resultado.tentativaUsada}`
      )

      if (cliente.latitude == null || cliente.longitude == null) {
        await this.prisma.cliente.update({
          where: { id: cliente.id },
          data: {
            latitude: resultado.latitude,
            longitude: resultado.longitude
          }
        })
      }

      clientesValidos.push({
        clienteId: cliente.id,
        nomeFantasia: cliente.nomeFantasia || 'Cliente sem nome',
        cidade: cliente.cidade || '',
        bairro: cliente.bairro || '',
        endereco: cliente.endereco || '',
        regiao,
        latitude: resultado.latitude,
        longitude: resultado.longitude,
        totalPeso: registro.totalPeso,
        totalValor: registro.totalValor,
        quantidadeItens: registro.quantidadeItens
      })
    }

    const clientesOrdenados = clientesValidos.sort((a, b) => {
      const regiaoCompare = a.regiao.localeCompare(b.regiao, 'pt-BR')
      if (regiaoCompare !== 0) return regiaoCompare

      const bairroCompare = a.bairro.localeCompare(b.bairro, 'pt-BR')
      if (bairroCompare !== 0) return bairroCompare

      const enderecoCompare = a.endereco.localeCompare(b.endereco, 'pt-BR')
      if (enderecoCompare !== 0) return enderecoCompare

      return a.nomeFantasia.localeCompare(b.nomeFantasia, 'pt-BR')
    })

    await this.prisma.$transaction([
      this.prisma.itemRomaneio.updateMany({
        where: { romaneioId: id },
        data: { ordemEntrega: null }
      }),
      ...clientesOrdenados.map((cliente, index) =>
        this.prisma.itemRomaneio.updateMany({
          where: {
            romaneioId: id,
            clienteId: cliente.clienteId
          },
          data: {
            ordemEntrega: index + 1
          }
        })
      )
    ])

    return {
      message: 'Rota base calculada com sucesso',
      resumo: {
        totalClientes: clientesUnicos.length,
        validosParaRota: clientesOrdenados.length,
        pendentes: clientesPendentes.length
      },
      clientesValidos: clientesOrdenados.map((cliente, index) => ({
        ordemEntrega: index + 1,
        ...cliente
      })),
      clientesPendentes
    }
  }

  async buscarRotaRomaneio(id: string) {
    const romaneio = await this.prisma.romaneio.findUnique({
      where: { id },
      include: {
        itensRomaneio: {
          include: {
            cliente: true,
            embalagem: true
          },
          orderBy: {
            ordemEntrega: 'asc'
          }
        }
      }
    })

    if (!romaneio) {
      throw new NotFoundException('Romaneio não encontrado')
    }

    const agrupado = new Map<
      string,
      {
        ordemEntrega: number | null
        clienteId: string
        nomeFantasia: string
        cidade: string
        bairro: string
        endereco: string
        regiao: string
        latitude: number | null
        longitude: number | null
        totalPeso: number
        totalValor: number
        quantidadeItens: number
      }
    >()

    for (const item of romaneio.itensRomaneio) {
      const cliente = item.cliente
      const regiao = this.obterRegiaoBase(cliente)
      const pesoItem = item.quantidade * (item.embalagem?.pesoUnitarioKg || 0)
      const valorItem = item.quantidade * (item.precoUnitario || 0)

      if (!agrupado.has(item.clienteId)) {
        agrupado.set(item.clienteId, {
          ordemEntrega: item.ordemEntrega ?? null,
          clienteId: item.clienteId,
          nomeFantasia: cliente?.nomeFantasia || 'Cliente sem nome',
          cidade: cliente?.cidade || '',
          bairro: cliente?.bairro || '',
          endereco: cliente?.endereco || '',
          regiao,
          latitude: cliente?.latitude ?? null,
          longitude: cliente?.longitude ?? null,
          totalPeso: 0,
          totalValor: 0,
          quantidadeItens: 0
        })
      }

      const atual = agrupado.get(item.clienteId)!
      atual.totalPeso += pesoItem
      atual.totalValor += valorItem
      atual.quantidadeItens += 1
    }

    const clientes = Array.from(agrupado.values()).sort((a, b) => {
      const ordemA = a.ordemEntrega ?? 9999
      const ordemB = b.ordemEntrega ?? 9999
      return ordemA - ordemB
    })

    const clientesValidos = clientes.filter((c) => c.latitude != null && c.longitude != null)
    const clientesPendentes = clientes.filter((c) => c.latitude == null || c.longitude == null)

    return {
      romaneioId: romaneio.id,
      clientesValidos,
      clientesPendentes
    }
  }

}