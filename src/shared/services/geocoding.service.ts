import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'

type ClienteEndereco = {
  endereco?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
}

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name)

  private limparTexto(valor?: string | null): string {
    if (!valor) return ''
    return valor
      .replace(/\s+/g, ' ')
      .trim()
  }

  private normalizarCidade(cidade?: string | null): string {
    const valor = this.limparTexto(cidade)

    if (!valor) return ''

    // remove coisas como: Itaperuna (RJ)
    return valor.replace(/\s*\([A-Z]{2}\)\s*/gi, '').trim()
  }

  private normalizarEstado(estado?: string | null, cidade?: string | null): string {
    const estadoLimpo = this.limparTexto(estado)

    if (estadoLimpo) return estadoLimpo

    const cidadeLimpa = this.limparTexto(cidade)
    const match = cidadeLimpa.match(/\(([A-Z]{2})\)/i)

    if (match?.[1]) return match[1].toUpperCase()

    return ''
  }

  private normalizarEndereco(endereco?: string | null): string {
    let valor = this.limparTexto(endereco)

    if (!valor) return ''

    valor = valor
      .replace(/^AV[\.\s]+/i, 'Avenida ')
      .replace(/^R[\.\s]+/i, 'Rua ')
      .replace(/^ROD[\.\s]+/i, 'Rodovia ')
      .replace(/^ESTR[\.\s]+/i, 'Estrada ')
      .replace(/\s+/g, ' ')
      .trim()

    return valor
  }

  private removerComplementoEndereco(endereco: string): string {
    if (!endereco) return ''

    // corta depois de " - " para evitar complemento tipo LOJA 01
    const semComplemento = endereco.split(' - ')[0].trim()

    return semComplemento
  }

  private montarTentativas(cliente: ClienteEndereco): string[] {
    const enderecoOriginal = this.normalizarEndereco(cliente.endereco)
    const enderecoSemComplemento = this.removerComplementoEndereco(enderecoOriginal)
    const bairro = this.limparTexto(cliente.bairro)
    const cidade = this.normalizarCidade(cliente.cidade)
    const estado = this.normalizarEstado(cliente.estado, cliente.cidade)

    const tentativas = [
      [enderecoSemComplemento, bairro, cidade, estado, 'Brasil'],
      [enderecoSemComplemento, cidade, estado, 'Brasil'],
      [bairro, cidade, estado, 'Brasil'],
      [cidade, estado, 'Brasil']
    ]
      .map((partes) => partes.filter(Boolean).join(', ').trim())
      .filter(Boolean)

    return Array.from(new Set(tentativas))
  }

  private enderecoMinimoValido(cliente: ClienteEndereco): boolean {
    const cidade = this.normalizarCidade(cliente.cidade)
    const estado = this.normalizarEstado(cliente.estado, cliente.cidade)
    return Boolean(cidade && estado)
  }

  async geocodeEndereco(endereco: string): Promise<{ latitude: number; longitude: number } | null> {
    const url = 'https://nominatim.openstreetmap.org/search'

    const response = await axios.get(url, {
      params: {
        q: endereco,
        format: 'json',
        limit: 1,
        countrycodes: 'br',
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'romaneio-app'
      },
      timeout: 10000
    })

    if (!Array.isArray(response.data) || response.data.length === 0) {
      return null
    }

    return {
      latitude: Number(response.data[0].lat),
      longitude: Number(response.data[0].lon)
    }
  }

  async garantirCoordenadasCliente(cliente: {
    id: string
    nomeFantasia?: string | null
    endereco?: string | null
    bairro?: string | null
    cidade?: string | null
    estado?: string | null
    latitude?: number | null
    longitude?: number | null
  }): Promise<
    | {
        ok: true
        latitude: number
        longitude: number
        enderecoCompleto: string
        tentativaUsada: string
      }
    | {
        ok: false
        motivo: string
        enderecoCompleto: string
      }
  > {
    const tentativas = this.montarTentativas(cliente)
    const enderecoPrincipal = tentativas[0] || ''

    if (cliente.latitude != null && cliente.longitude != null) {
      return {
        ok: true,
        latitude: cliente.latitude,
        longitude: cliente.longitude,
        enderecoCompleto: enderecoPrincipal,
        tentativaUsada: 'coordenadas já existentes no banco'
      }
    }

    if (!this.enderecoMinimoValido(cliente)) {
      return {
        ok: false,
        motivo: 'Cidade/estado insuficientes para geocodificação',
        enderecoCompleto: enderecoPrincipal
      }
    }

    for (const tentativa of tentativas) {
      try {
        this.logger.log(`Geocodificando cliente ${cliente.id}: ${tentativa}`)

        const coords = await this.geocodeEndereco(tentativa)

        if (coords) {
          return {
            ok: true,
            latitude: coords.latitude,
            longitude: coords.longitude,
            enderecoCompleto: enderecoPrincipal,
            tentativaUsada: tentativa
          }
        }
      } catch (error: any) {
        this.logger.error(
          `Erro ao geocodificar cliente ${cliente.id} na tentativa "${tentativa}": ${error?.message || 'erro desconhecido'}`
        )
      }
    }

    return {
      ok: false,
      motivo: 'Não foi possível localizar o endereço',
      enderecoCompleto: enderecoPrincipal
    }
  }
}