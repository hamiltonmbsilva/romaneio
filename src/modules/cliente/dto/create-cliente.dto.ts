import {
  IsString,
  IsNotEmpty,
  Matches,
} from 'class-validator'

export class CreateClienteDTO {

  ativo: boolean

  nomeFantasia?: string

  telefone?: string

  contato?: string

  email?: string

  cidade?: string

  estado?: string

  endereco?: string

  bairro?: string

  cep?: string

  inscricaoEstadual?: string

}