import { IsString, IsNumber, IsNotEmpty, IsBoolean } from 'class-validator'

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
  ativo: boolean
}