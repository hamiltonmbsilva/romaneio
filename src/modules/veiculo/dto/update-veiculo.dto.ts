import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator'

export class UpdateVeiculoDTO {
  @IsOptional()
  @IsString()
  placa?: string

  @IsOptional()
  @IsString()
  modelo?: string

  @IsOptional()
  @IsNumber()
  ano?: number

  @IsOptional()
  @IsNumber()
  kmInicial?: number

  @IsOptional()
  @IsNumber()
  capacidadeKg?: number

  @IsOptional()
  @IsBoolean()
  ativo?: boolean
}