import { IsString, IsOptional, IsNotEmpty } from "class-validator"

export class CreateMotoristaDTO {

  @IsString()
  @IsNotEmpty({ message: "Nome é obrigatório" })
  nome: string

  @IsOptional()
  @IsString()
  telefone?: string

  @IsOptional()
  @IsString()
  cnh?: string
  
  @IsString()
  endereco?: string
}