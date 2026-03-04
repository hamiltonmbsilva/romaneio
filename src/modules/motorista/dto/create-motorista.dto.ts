import { IsString } from 'class-validator'

export class CreateMotoristaDTO {
  @IsString()
  nome: string

  @IsString()
  cnh: string

  @IsString()
  endereco: string

  @IsString()
  telefone: string
}