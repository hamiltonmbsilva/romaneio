import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { CreateMotoristaDTO } from './dto/create-motorista.dto'
import { UpdateMotoristaDTO } from './dto/update-motorista.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class MotoristaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMotoristaDTO) {

    try {

      return this.prisma.motorista.create({
        data: {
          nome: dto.nome,
          telefone: dto.telefone ?? "",
          cnh: dto.cnh ?? "",
          endereco: dto.endereco ?? "",
          //ativo: true
        }
      })

    } catch (error: any) {

    // 🚨 ERRO DE CNH DUPLICADA
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new BadRequestException("Já existe um motorista com essa CNH")
    }

    throw error
  }  

}

  async findAll() {
    return this.prisma.motorista.findMany()
  }

  async findOne(id: string) {
    const motorista = await this.prisma.motorista.findUnique({
      where: { id },
    })

    if (!motorista) {
      throw new NotFoundException('Motorista não encontrado')
    }

    return motorista
  }

  async update(id: string, data: UpdateMotoristaDTO) {
    await this.findOne(id)

    return this.prisma.motorista.update({
      where: { id },
      data,
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.motorista.delete({
      where: { id },
    })
  }
}
