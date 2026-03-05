import { IsString, IsNumber } from 'class-validator'

export class CreateEmbalagemDTO {

  @IsString()
  descricao: string

  @IsNumber()
  unidades: number

  @IsNumber()
  pesoUnitarioKg: number

  @IsString()
  produtoId: string

}