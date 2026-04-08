import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/shared/prisma/prisma.service"
import { CreateClienteDTO } from "./dto/create-cliente.dto"
import { UpdateClienteDTO } from "./dto/update-cliente.dto"
import { GeocodingService } from "src/shared/services/geocoding.service"
import { RegiaoClienteService } from "src/shared/services/regiao-cliente.service"

@Injectable()
export class ClienteService {
  constructor(
    private prisma: PrismaService,
    private geocodingService: GeocodingService,
    private regiaoClienteService: RegiaoClienteService
  ) {}

  async criar(dto: CreateClienteDTO) {
    let latitude: number | null = null
    let longitude: number | null = null

    const geo = await this.geocodingService.garantirCoordenadasCliente({
      id: "novo-cliente",
      nomeFantasia: dto.nomeFantasia,
      endereco: dto.endereco,
      bairro: dto.bairro,
      cidade: dto.cidade,
      estado: dto.estado,
      latitude: null,
      longitude: null
    })

    if (geo.ok) {
      latitude = geo.latitude
      longitude = geo.longitude
    }

    const regiao = this.regiaoClienteService.definirRegiao({
      cidade: dto.cidade,
      estado: dto.estado,
      bairro: dto.bairro,
      latitude,
      longitude
    })

    return this.prisma.cliente.create({
      data: {
        nomeFantasia: dto.nomeFantasia ?? "",
        telefone: dto.telefone ?? "",
        contato: dto.contato ?? "",
        email: dto.email ?? "",
        cidade: dto.cidade ?? "",
        estado: dto.estado ?? "",
        endereco: dto.endereco ?? "",
        bairro: dto.bairro ?? "",
        cep: dto.cep ?? "",
        inscricaoEstadual: dto.inscricaoEstadual ?? "",
        regiao,

        latitude,
        longitude,

        ativo: true
      }
    })
  }

  async atualizar(id: string, dto: UpdateClienteDTO) {
    const clienteAtual = await this.prisma.cliente.findUnique({
      where: { id }
    })

    if (!clienteAtual) {
      throw new NotFoundException("Cliente não encontrado")
    }

    let latitude = clienteAtual.latitude
    let longitude = clienteAtual.longitude

    const enderecoMudou =
      dto.endereco !== undefined ||
      dto.bairro !== undefined ||
      dto.cidade !== undefined ||
      dto.estado !== undefined ||
      dto.cep !== undefined

    if (latitude == null || longitude == null || enderecoMudou) {
      const geo = await this.geocodingService.garantirCoordenadasCliente({
        id: clienteAtual.id,
        nomeFantasia: dto.nomeFantasia ?? clienteAtual.nomeFantasia,
        endereco: dto.endereco ?? clienteAtual.endereco,
        bairro: dto.bairro ?? clienteAtual.bairro,
        cidade: dto.cidade ?? clienteAtual.cidade,
        estado: dto.estado ?? clienteAtual.estado,
        latitude: null,
        longitude: null
      })

      if (geo.ok) {
        latitude = geo.latitude
        longitude = geo.longitude
      }
    }

    const regiao = this.regiaoClienteService.definirRegiao({
      cidade: dto.cidade ?? clienteAtual.cidade,
      estado: dto.estado ?? clienteAtual.estado,
      bairro: dto.bairro ?? clienteAtual.bairro,
      latitude,
      longitude
    })

    return this.prisma.cliente.update({
      where: { id },
      data: {
        ...dto,
        latitude,
        longitude,
        regiao
      }
    })
  }

  async gerarCoordenadas(id: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id }
    })

    if (!cliente) {
      throw new NotFoundException("Cliente não encontrado")
    }

    const geo = await this.geocodingService.garantirCoordenadasCliente({
      id: cliente.id,
      nomeFantasia: cliente.nomeFantasia,
      endereco: cliente.endereco,
      bairro: cliente.bairro,
      cidade: cliente.cidade,
      estado: cliente.estado,
      latitude: null,
      longitude: null
    })

    if (!geo.ok) {
      return {
        message: "Endereço não encontrado",
        sucesso: false,
        motivo: geo.motivo,
        endereco: geo.enderecoCompleto
      }
    }

    const regiao = this.regiaoClienteService.definirRegiao({
      cidade: cliente.cidade,
      estado: cliente.estado,
      bairro: cliente.bairro,
      latitude: geo.latitude,
      longitude: geo.longitude
    })

    return this.prisma.cliente.update({
      where: { id },
      data: {
        latitude: geo.latitude,
        longitude: geo.longitude,
        regiao
      }
    })
  }

  async buscarClientes(nome?: string) {
    return this.prisma.cliente.findMany({
      where: {
        nomeFantasia: {
          contains: nome,
          mode: "insensitive"
        }
      },
      orderBy: {
        nomeFantasia: "asc"
      },
      take: 10
    })
  }

  async listar(
    page: number,
    search?: string,
    cidade?: string,
    estado?: string
  ) {
    const limit = 10
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        {
          nomeFantasia: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          endereco: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          bairro: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    }

    if (cidade) {
      where.cidade = {
        contains: cidade,
        mode: "insensitive"
      }
    }

    if (estado) {
      where.estado = {
        contains: estado,
        mode: "insensitive"
      }
    }

    const [clientes, total] = await this.prisma.$transaction([
      this.prisma.cliente.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      this.prisma.cliente.count({ where })
    ])

    return {
      data: clientes,
      total
    }
  }

  async listarMapa() {
    const clientes = await this.prisma.cliente.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        ativo: true
      },
      select: {
        id: true,
        nomeFantasia: true,
        latitude: true,
        longitude: true,
        cidade: true,
        bairro: true,
        endereco: true,
        regiao: true
      },
      orderBy: {
        nomeFantasia: "asc"
      }
    })

    console.log("CLIENTES MAPA:", clientes)

    return clientes
  }

  async listarPorRegiao() {
    const clientes = await this.prisma.cliente.findMany({
      orderBy: [{ regiao: "asc" }, { nomeFantasia: "asc" }]
    })

    const agrupado: Record<string, any[]> = {}

    for (const cliente of clientes) {
      const regiao = cliente.regiao || "Sem região definida"

      if (!agrupado[regiao]) {
        agrupado[regiao] = []
      }

      agrupado[regiao].push(cliente)
    }

    return {
      total: clientes.length,
      regioes: Object.entries(agrupado).map(([regiao, itens]) => ({
        regiao,
        quantidade: itens.length,
        clientes: itens
      }))
    }
  }

  async atualizarBaseGeografica() {
    const clientes = await this.prisma.cliente.findMany({
      orderBy: { nomeFantasia: "asc" }
    })

    const atualizados: any[] = []
    const pendentes: any[] = []

    for (const cliente of clientes) {
      let latitude = cliente.latitude
      let longitude = cliente.longitude

      if (latitude == null || longitude == null) {
        const geo = await this.geocodingService.garantirCoordenadasCliente({
          id: cliente.id,
          nomeFantasia: cliente.nomeFantasia,
          endereco: cliente.endereco,
          bairro: cliente.bairro,
          cidade: cliente.cidade,
          estado: cliente.estado,
          latitude: cliente.latitude,
          longitude: cliente.longitude
        })

        if (geo.ok) {
          latitude = geo.latitude
          longitude = geo.longitude
        } else {
          pendentes.push({
            id: cliente.id,
            nomeFantasia: cliente.nomeFantasia,
            motivo: geo.motivo,
            endereco: geo.enderecoCompleto
          })
        }
      }

      const regiao = this.regiaoClienteService.definirRegiao({
        cidade: cliente.cidade,
        estado: cliente.estado,
        bairro: cliente.bairro,
        latitude,
        longitude
      })

      const clienteAtualizado = await this.prisma.cliente.update({
        where: { id: cliente.id },
        data: {
          latitude,
          longitude,
          regiao
        }
      })

      atualizados.push(clienteAtualizado)
    }

    return {
      totalClientes: clientes.length,
      atualizados: atualizados.length,
      pendentes: pendentes.length,
      clientesPendentes: pendentes
    }
  }

  async deletar(id: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id }
    })

    if (!cliente) {
      throw new NotFoundException("Cliente não encontrado")
    }

    return this.prisma.cliente.delete({
      where: { id }
    })
  }

  async buscar(id: string) {
    return this.prisma.cliente.findUnique({
      where: { id }
    })
  }
}
