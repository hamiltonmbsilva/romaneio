import { Controller,Post,Body,Param,Get,Put } from "@nestjs/common"
import { VeiculoKmService } from "./veiculo-km.service"

@Controller("veiculo-km")
export class VeiculoKmController{

 constructor(private service:VeiculoKmService){}

 @Post("saida")
 registrarSaida(@Body() body:any){

   return this.service.registrarSaida(
     body.veiculoId,
     body.kmSaida
   )

 }

 @Put("retorno/:id")
 registrarRetorno(
   @Param("id") id:string,
   @Body() body:any
 ){

   return this.service.registrarRetorno(
     id,
     body.kmRetorno
   )

 }

 @Get(":veiculoId")
 listar(@Param("veiculoId") veiculoId:string){

   return this.service.listarPorVeiculo(veiculoId)

 }

}