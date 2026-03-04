import { IsString, IsOptional } from 'class-validator'

export class UpdateMotoristaDTO {
  @IsOptional()
  @IsString()
  nome?: string

  @IsOptional()
  @IsString()
  cnh?: string

  @IsOptional()
  @IsString()
  endereco?: string

  @IsOptional()
  @IsString()
  telefone?: string
}