import { IsString, IsNumber, IsNotEmpty } from 'class-validator'

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
}