import { Controller, Post, Get, Param, Body } from "@nestjs/common"
import { VeiculoKmService } from "./veiculo-km.service"

@Controller("veiculo-km")
export class VeiculoKmController{

 constructor(private service:VeiculoKmService){}

 @Post("saida")
 registrarSaida(@Body() body:any){

  return this.service.registrarSaida(body.veiculoId, body.kmSaida)

 }

 @Post("retorno")
 registrarRetorno(@Body() body:any){

  return this.service.registrarRetorno(body.id, body.kmRetorno)

 }

 @Get(":veiculoId")
 listar(@Param("veiculoId") veiculoId:string){

  return this.service.listarPorVeiculo(veiculoId)

 }

}