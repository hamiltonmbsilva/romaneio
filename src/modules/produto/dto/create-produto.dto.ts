import { IsString } from 'class-validator'

export class CreateProdutoDTO {

  @IsString()
  nome: string

}