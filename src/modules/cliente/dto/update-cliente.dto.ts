import { IsOptional, IsString } from 'class-validator'

export class UpdateClienteDTO {

  @IsOptional()
  @IsString()
  nomeFantasia?: string

  @IsOptional()
  @IsString()
  documento?: string

  @IsOptional()
  @IsString()
  telefone?: string

  @IsOptional()
  @IsString()
  rua?: string

  @IsOptional()
  @IsString()
  numero?: string

  @IsOptional()
  @IsString()
  bairro?: string

  @IsOptional()
  @IsString()
  cep?: string

  @IsOptional()
  @IsString()
  estado?: string

  @IsOptional()
  @IsString()
  contatoNome?: string

  @IsOptional()
  @IsString()
  contatoCargo?: string
}