import {
 Controller,
 Get,
 Post,
 Patch,
 Delete,
 Param,
 Body,
 Query
} from "@nestjs/common"

import { ClienteService } from "./cliente.service"
import { CreateClienteDTO } from "./dto/create-cliente.dto"
import { UpdateClienteDTO } from "./dto/update-cliente.dto"


@Controller("cliente")
export class ClienteController{

 constructor(private service:ClienteService){}

 @Post()
 criar(@Body() dto:CreateClienteDTO){
  return this.service.criar(dto)
 }

 @Get()
    listar(
        @Query("page") page:string,
        @Query("search") search?:string
    ){
        return this.service.listar(
        Number(page) || 1,
        search
        )
    }

 @Patch(":id")
 atualizar(
  @Param("id") id:string,
  @Body() dto:UpdateClienteDTO
 ){
  return this.service.atualizar(id,dto)
 }

 @Delete(":id")
 deletar(@Param("id") id:string){
  return this.service.deletar(id)
 }

}
