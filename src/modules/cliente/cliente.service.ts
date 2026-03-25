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
   bairro: dto.bairro ?? "",
   cep: dto.cep ?? "",
   inscricaoEstadual: dto.inscricaoEstadual ?? "",

   latitude: coords?.latitude,
   longitude: coords?.longitude,

   ativo: true
  }
 })

}

async atualizar(id: string, dto: UpdateClienteDTO) {

 const clienteAtual = await this.prisma.cliente.findUnique({
  where: { id }
 })

 let latitude = clienteAtual?.latitude
 let longitude = clienteAtual?.longitude

 // 👉 SE NÃO TEM COORDENADA OU MUDOU ENDEREÇO
 if (
  !latitude ||
  !longitude ||
  dto.endereco ||
  dto.cidade ||
  dto.estado ||
  dto.bairro ||
  dto.cep
 ) {

  const enderecoCompleto = `
   ${dto.endereco || clienteAtual?.endereco},
   ${dto.bairro || clienteAtual?.bairro},
   ${dto.cidade || clienteAtual?.cidade},
   ${dto.estado || clienteAtual?.estado},
   ${dto.cep || clienteAtual?.cep},
   Brasil
  `
   .replace(/\s+/g, " ")
   .trim()

  const coords = await geocodeEndereco(enderecoCompleto)

  if (coords) {
   latitude = coords.latitude
   longitude = coords.longitude
  }
 }

 

 return this.prisma.cliente.update({
  where: { id },
  data: {
   ...dto,
   latitude,
   longitude
  }
 })
}


async gerarCoordenadas(id: string) {

 const cliente = await this.prisma.cliente.findUnique({
  where: { id }
 })

 console.log("Serviço",id)

 const enderecoCompleto = `
  ${cliente?.endereco},
  ${cliente?.bairro},
  ${cliente?.cidade},
  ${cliente?.estado},
  ${cliente?.cep},
  Brasil
 `
  .replace(/\n/g, " ")
  .replace(/\s+/g, " ")
  .replace(/,+/g, ",") // remove vírgulas duplicadas
  .replace(", ,", ",") // remove vazio
  .trim()

 const coords = await geocodeEndereco(enderecoCompleto)

 if (!coords) {
  console.log("❌ Não encontrou coordenadas para:", enderecoCompleto)

  return {
    message: "Endereço não encontrado",
    sucesso: false
  }
}

 return this.prisma.cliente.update({
  where: { id },
  data: {
   latitude: coords.latitude,
   longitude: coords.longitude
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

// async listarMapa(){
//  return this.prisma.cliente.findMany({
//   take: 10
//  })
// }

// async listarMapa(){

//  return this.prisma.cliente.findMany({
//   where:{
//    latitude:{ not:null },
//    longitude:{ not:null },
//    ativo:true
//   },
//   select:{
//    id:true,
//    nomeFantasia:true,
//    latitude:true,
//    longitude:true
//   }
//  })

// }

async listarMapa(){

 const clientes = await this.prisma.cliente.findMany({
  where:{
   latitude:{ not:null },
   longitude:{ not:null },
   ativo:true
  },
  select:{
   id:true,
   nomeFantasia:true,
   latitude:true,
   longitude:true
  }
 })

 console.log("CLIENTES MAPA:", clientes)

 return clientes
}
// async listarMapa(){

//  return this.prisma.cliente.findMany({
//   select:{
//    id:true,
//    nomeFantasia:true,
//    latitude:true,
//    longitude:true
//   }
//  })

// }

 

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
