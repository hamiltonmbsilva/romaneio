import { IsString, IsNumber } from 'class-validator'

export class AddItemRomaneioDTO {

  @IsString()
  romaneioId: string  

  @IsString()
  clienteId: string

  @IsString()
  produtoId: string

  @IsString()
  embalagemId: string

  @IsNumber()
  quantidade: number

  @IsNumber()
  precoUnitario?: number
}