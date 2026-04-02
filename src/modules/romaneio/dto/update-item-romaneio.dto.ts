import { IsOptional, IsNumber } from 'class-validator'

export class UpdateItemRomaneioDTO {

  @IsOptional()
  @IsNumber()
  quantidade?: number

  @IsOptional()
  @IsNumber()
  precoUnitario?: number
}