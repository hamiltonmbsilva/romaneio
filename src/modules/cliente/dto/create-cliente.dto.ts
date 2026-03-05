import {
  IsString,
  IsNotEmpty,
  Matches,
} from 'class-validator'

export class CreateClienteDTO {

  @IsString()
  @IsNotEmpty()
  nomeFantasia: string

  @IsString()
  @Matches(/^\d{11}|\d{14}$/, {
    message: 'Documento deve ser CPF (11) ou CNPJ (14)'
  })
  documento: string

  @IsString()
  telefone: string

  @IsString()
  rua: string

  @IsString()
  numero: string

  @IsString()
  bairro: string

  @Matches(/^\d{8}$/,{ message: 'CEP inválido'})
  cep: string

  @IsString()
  estado: string

  @IsString()
  contatoNome: string

  @IsString()
  contatoCargo: string
}