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
    criar(@Body() dto: CreateClienteDTO){
        return this.service.criar(dto)
    }

 @Get()
    listar(
        @Query("page") page:string,
        @Query("search") search?:string,
        @Query("cidade") cidade?:string
    ){
        return this.service.listar(
        Number(page) || 1,
        search,cidade
        )
    }

 @Get("mapa")
        listarMapa(){
        console.log("🔥 BATEU NO ENDPOINT MAPA")
        return this.service.listarMapa()
      }

    @Patch(":id/geocode")
      async gerarCoordenadas(@Param("id") id: string) {
      console.log("🔥 ENTROU NO BACK:", id)
      return this.service.gerarCoordenadas(id)
      }

 @Patch(":id") 
    atualizar(
        @Param("id") id:string,
        @Body() dto:UpdateClienteDTO
        ){
            console.log("ID recebido:", id)
            console.log("DTO recebido:", dto)
            
    return this.service.atualizar(id,dto)
 }

 @Get(":id")
    buscar(@Param("id") id:string){
    return this.service.buscar(id)
    }

 @Delete(":id")
 deletar(@Param("id") id:string){

    console.log("Deletar controller:", id)
  return this.service.deletar(id)
 }

 

}
