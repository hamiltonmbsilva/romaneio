import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/prisma/prisma.service'
import { CreateRomaneioDTO } from './dto/create-romaneio.dto'

@Injectable()
export class RomaneioService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateRomaneioDTO) {
    return this.prisma.romaneio.create({
      data
    })
  }

  async findAll() {
    return this.prisma.romaneio.findMany({
      include: {
        motorista: true,
        veiculo: true
      }
    })
  }

  async findOne(id: string) {
    return this.prisma.romaneio.findUnique({
      where: { id },
      include: {
        entregas: {
          include: {
            cliente: true,
            itens: {
              include: {
                produto: true,
                embalagem: true
              }
            }
          }
        }
      }
    })
  }

  async remove(id: string) {
    return this.prisma.romaneio.delete({
      where: { id }
    })
  }
}