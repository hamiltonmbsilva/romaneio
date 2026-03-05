import { IsOptional, IsString } from 'class-validator'

export class UpdateProdutoDTO {

  @IsOptional()
  @IsString()
  nome?: string

}