import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/shared/prisma/prisma.service"
import { NotFoundException } from "@nestjs/common"
import { BadRequestException } from '@nestjs/common'

@Injectable()
export class VeiculoKmService{

 constructor(private prisma:PrismaService){}

 async registrarSaida(veiculoId:string,kmSaida:number){
    console.log(veiculoId,kmSaida)

   return this.prisma.veiculoKm.create({
     data:{
       veiculoId,
       kmSaida
     }

   })

 }

 async registrarRetorno(id:string,kmRetorno:number){

    const registro = await this.prisma.veiculoKm.findUnique({
    where:{id}
    })

    if(!registro){
        throw new NotFoundException("Registro não encontrado")
    }

    const kmRodado = kmRetorno - registro.kmSaida

    if(kmRetorno < registro.kmSaida){

        throw new BadRequestException(
            "KM retorno não pode ser menor que KM saída"
        )
    }

    return this.prisma.veiculoKm.update({

    where:{id},

    data:{
        kmRetorno,
        kmRodado,
        dataRetorno:new Date()
    }

    })

 }

 async listarPorVeiculo(veiculoId:string){

   return this.prisma.veiculoKm.findMany({

     where:{veiculoId},
     orderBy:{dataSaida:"desc"}

   })

 }

}