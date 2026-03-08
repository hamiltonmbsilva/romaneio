import { Controller, Post, Body, Get, Param } from "@nestjs/common"
import { VeiculoKmService } from "./veiculo-km.service"

@Controller("veiculo-km")
export class VeiculoKmController{  

 constructor(private service:VeiculoKmService){}

 @Get()
 teste(){
  return { message:"API Veiculo KM funcionando" }
 }

 @Post("saida")
 registrarSaida(@Body() body:any){

  console.log("BODY:",body)

  return this.service.registrarSaida(
   body.veiculoId,
   body.kmSaida
  )

 }

 @Post("retorno")
 registrarRetorno(@Body() body:any){

  return this.service.registrarRetorno(
   body.id,
   body.kmRetorno
  )

 }

 @Get("veiculo/:veiculoId")
 listarPorVeiculo(@Param("veiculoId") veiculoId:string){

  return this.service.listarPorVeiculo(veiculoId)

 }

}