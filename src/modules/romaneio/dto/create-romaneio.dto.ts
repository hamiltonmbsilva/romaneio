import { IsString, IsNotEmpty, IsOptional } from "class-validator"

export class CreateRomaneioDTO {

  @IsOptional()
  numero?: number

  @IsOptional()
  rota: string

  @IsString()
  @IsNotEmpty()
  motoristaId: string

  @IsString()
  @IsNotEmpty()
  veiculoId: string

  @IsString()
  @IsNotEmpty()
  dataSaida: string
}

