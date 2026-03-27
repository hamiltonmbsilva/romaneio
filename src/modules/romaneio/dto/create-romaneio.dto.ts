import { IsString, IsNotEmpty } from "class-validator"

export class CreateRomaneioDTO {



  @IsString()
  @IsNotEmpty()
  numero: string


  @IsString()
  @IsNotEmpty()
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