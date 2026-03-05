import {
  Injectable,
  NotFoundException
} from '@nestjs/common'

import { PrismaService } from 'src/shared/prisma/prisma.service'

import { CreateEmbalagemDTO } from './dto/create-embalagem.dto'
import { UpdateEmbalagemDTO } from './dto/update-embalagem.dto'

@Injectable()
export class EmbalagemService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateEmbalagemDTO) {

    return this.prisma.embalagem.create({
      data
    })

  }

  async findAll() {

    return this.prisma.embalagem.findMany({
      include: {
        produto: true
      }
    })

  }

  async findOne(id: string) {

    const embalagem = await this.prisma.embalagem.findUnique({
      where: { id },
      include: { produto: true }
    })

    if (!embalagem) {
      throw new NotFoundException('Embalagem não encontrada')
    }

    return embalagem
  }

  async update(id: string, data: UpdateEmbalagemDTO) {

    await this.findOne(id)

    return this.prisma.embalagem.update({
      where: { id },
      data
    })

  }

  async remove(id: string) {

    await this.findOne(id)

    return this.prisma.embalagem.delete({
      where: { id }
    })

  }

}