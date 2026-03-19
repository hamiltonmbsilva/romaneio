import { IsString, IsNumber } from "class-validator"

export class ClienteMapaDTO {

 @IsString()
 id: string

 @IsString()
 nomeFantasia: string

 @IsNumber()
 latitude: number

 @IsNumber()
 longitude: number

}