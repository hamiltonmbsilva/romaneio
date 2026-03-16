import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/shared/prisma/prisma.service"
import { CreateClienteDTO } from "./dto/create-cliente.dto"
import { UpdateClienteDTO } from "./dto/update-cliente.dto"
import { geocodeEndereco } from "src/shared/services/geocode.service"

@Injectable()
export class ClienteService{

 constructor(private prisma:PrismaService){}


 async criar(dto: CreateClienteDTO){

 const enderecoCompleto = `${dto.endereco}, ${dto.cidade}, ${dto.estado}`

 const coords = await geocodeEndereco(enderecoCompleto)

 return this.prisma.cliente.create({
  data:{
   nomeFantasia: dto.nomeFantasia ?? "",
   telefone: dto.telefone ?? "",
   contato: dto.contato ?? "",
   email: dto.email ?? "",
   cidade: dto.cidade ?? "",
   estado: dto.estado ?? "",
   endereco: dto.endereco ?? "",
   cep: dto.cep ?? "",
   inscricaoEstadual: dto.inscricaoEstadual ?? "",

   latitude: coords?.latitude,
   longitude: coords?.longitude,
   
   ativo: true
  }
 })

}

async atualizar(id:string,dto:UpdateClienteDTO){   

 return this.prisma.cliente.update({
  where:{ id },
  data:{
   ...dto
  }
 })

}


async listar(page:number,search?:string,cidade?:string,estado?:string){

 const limit = 10
 const skip = (page-1)*limit

 const where:any = {}

 if(search){
  where.nomeFantasia = {
   contains: search,
   mode: "insensitive"
  }
 }

 if(cidade){
  where.cidade = {
   contains: cidade,
   mode: "insensitive"
  }
 }


 const [clientes,total] = await this.prisma.$transaction([
  this.prisma.cliente.findMany({
   where,
   skip,
   take:limit
  }),
  this.prisma.cliente.count({where})
 ])

 return {
  data:clientes,
  total
 }
}

 

 async deletar(id:string){   

  return this.prisma.cliente.delete({
    where:{id}
  })

 }

 async buscar(id:string){

 return this.prisma.cliente.findUnique({
  where:{id}
 })

}

 

}
