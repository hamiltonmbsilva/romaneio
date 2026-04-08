import { Injectable } from '@nestjs/common'

type ClienteInput = {
  cidade?: string | null
  estado?: string | null
  bairro?: string | null
  latitude?: number | null
  longitude?: number | null
}

@Injectable()
export class RegiaoClienteService {
  private limpar(valor?: string | null) {
    return (valor || '').trim().toLowerCase()
  }

  definirRegiao(cliente: ClienteInput): string {
    const cidade = this.limpar(cliente.cidade)
    const estado = this.limpar(cliente.estado)
    const bairro = this.limpar(cliente.bairro)

    if (cidade.includes('valença')) return 'Valença'
    if (cidade.includes('itaperuna')) return 'Noroeste Fluminense'
    if (cidade.includes('juiz de fora')) return 'Zona da Mata'
    if (cidade.includes('petropolis')) return 'Região Serrana'
    if (cidade.includes('teresopolis')) return 'Região Serrana'
    if (cidade.includes('nova friburgo')) return 'Região Serrana'
    if (cidade.includes('macae')) return 'Norte Fluminense'
    if (cidade.includes('campos')) return 'Norte Fluminense'
    if (cidade.includes('cabo frio')) return 'Região dos Lagos'
    if (cidade.includes('arraial')) return 'Região dos Lagos'
    if (cidade.includes('buzios')) return 'Região dos Lagos'
    if (cidade.includes('angra')) return 'Costa Verde'
    if (cidade.includes('paraty')) return 'Costa Verde'
    if (cidade.includes('barra mansa')) return 'Sul Fluminense'
    if (cidade.includes('resende')) return 'Sul Fluminense'
    if (cidade.includes('volta redonda')) return 'Sul Fluminense'

    if (cidade.includes('rio de janeiro') || cidade === 'rio') {
      if (
        bairro.includes('campo grande') ||
        bairro.includes('bangu') ||
        bairro.includes('realengo') ||
        bairro.includes('santa cruz') ||
        bairro.includes('recreio') ||
        bairro.includes('barra')
      ) {
        return 'Rio - Zona Oeste'
      }

      if (
        bairro.includes('copacabana') ||
        bairro.includes('ipanema') ||
        bairro.includes('leblon') ||
        bairro.includes('botafogo') ||
        bairro.includes('flamengo') ||
        bairro.includes('lagoa')
      ) {
        return 'Rio - Zona Sul'
      }

      if (
        bairro.includes('tijuca') ||
        bairro.includes('vila isabel') ||
        bairro.includes('maracana') ||
        bairro.includes('grajau')
      ) {
        return 'Rio - Zona Norte'
      }

      if (
        bairro.includes('centro') ||
        bairro.includes('saude') ||
        bairro.includes('gamboa') ||
        bairro.includes('santo cristo')
      ) {
        return 'Rio - Centro'
      }

      return 'Rio de Janeiro'
    }

    if (
      cidade.includes('duque de caxias') ||
      cidade.includes('nova iguaçu') ||
      cidade.includes('nilopolis') ||
      cidade.includes('belford roxo') ||
      cidade.includes('mesquita') ||
      cidade.includes('queimados') ||
      cidade.includes('sao joao de meriti')
    ) {
      return 'Baixada Fluminense'
    }

    if (
      cidade.includes('niteroi') ||
      cidade.includes('sao goncalo') ||
      cidade.includes('itatiaia')
    ) {
      return 'Leste Metropolitano'
    }

    if (estado === 'rj' || estado === 'rio de janeiro') {
      return 'Interior RJ'
    }

    if (estado === 'mg' || estado === 'minas gerais') {
      return 'Interior MG'
    }

    return 'Sem região definida'
  }
}