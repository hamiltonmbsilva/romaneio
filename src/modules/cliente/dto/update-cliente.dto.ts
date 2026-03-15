import { IsOptional, IsString, IsBoolean } from "class-validator"

export class UpdateClienteDTO {

 @IsOptional()
 @IsBoolean()
 ativo?: boolean

 @IsOptional()
 @IsString()
 nomeFantasia?: string

 @IsOptional()
 @IsString()
 telefone?: string

 @IsOptional()
 @IsString()
 contato?: string

 @IsOptional()
 @IsString()
 email?: string

 @IsOptional()
 @IsString()
 cidade?: string

 @IsOptional()
 @IsString()
 estado?: string

 @IsOptional()
 @IsString()
 endereco?: string

 @IsOptional()
 @IsString()
 cep?: string

 @IsOptional()
 @IsString()
 inscricaoEstadual?: string

}