import { IsOptional, IsNumber, IsString } from 'class-validator'

export class UpdateEmbalagemDTO {

  @IsOptional()
  @IsString()
  descricao?: string

  @IsOptional()
  @IsNumber()
  unidades?: number

  @IsOptional()
  @IsNumber()
  pesoUnitarioKg?: number

}