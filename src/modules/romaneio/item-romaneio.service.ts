import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/prisma/prisma.service'

@Injectable()
export class ItemRomaneioService {

  constructor(private prisma: PrismaService) {}

  async remove(id: string) {
    return this.prisma.itemRomaneio.delete({
      where: { id }
    })
  }

  async update(id: string, data: any) {
    return this.prisma.itemRomaneio.update({
      where: { id },
      data
    })
  }
}