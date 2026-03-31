import { IsString , IsOptional, IsNumber} from 'class-validator'

export class CreateProdutoDTO {

  @IsString()
  nome: string

  @IsOptional()
  @IsNumber()
  estoque?: number

}