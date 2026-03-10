import { IsString, IsNumber, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator'

export class CreateVeiculoDTO {
  @IsString()
  @IsNotEmpty()
  placa: string

  @IsString()
  @IsNotEmpty()
  modelo: string

  @IsNumber()
  ano: number

  @IsNumber()
  kmInicial: number

  @IsNumber()
  capacidadeKg: number

  @IsBoolean()
  @IsOptional()
  ativo?: boolean
}