import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/shared/prisma/prisma.service"
import { CreateClienteDTO } from "./dto/create-cliente.dto"
import { UpdateClienteDTO } from "./dto/update-cliente.dto"

@Injectable()
export class ClienteService{

 constructor(private prisma:PrismaService){}

 async criar(dto: CreateClienteDTO){

 return this.prisma.cliente.create({

  data:{

   ativo: dto.ativo,

   nomeFantasia: dto.nomeFantasia,

   telefone: dto.telefone ?? null,

   contato: dto.contato ?? null,

   email: dto.email ?? null,

   cidade: dto.cidade,

   estado: dto.estado,

   endereco: dto.endereco ?? "",

   cep: dto.cep ?? "",

   inscricaoEstadual: dto.inscricaoEstadual ?? ""

  }

 })

}

async listar(page:number,search?:string){

 const limit = 10
 const skip = (page - 1) * limit

 return this.prisma.cliente.findMany({

  where:{
   nomeFantasia:{
    contains:search,
    mode:"insensitive"
   }
  },

  skip,
  take:limit,

  orderBy:{
   nomeFantasia:"asc"
  }

 })

}

 async atualizar(id:string,dto:UpdateClienteDTO){

  return this.prisma.cliente.update({
    where:{id},
    data:dto
  })

 }

 async deletar(id:string){

  return this.prisma.cliente.delete({
    where:{id}
  })

 }

}
