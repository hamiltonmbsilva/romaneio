import { Module } from '@nestjs/common'
import { ItemEntregaService } from './item-entrega.service'
import { ItemEntregaController } from './item-entrega.controller'
import { PrismaService } from '../../shared/prisma/prisma.service'

@Module({
  controllers: [ItemEntregaController],
  providers: [ItemEntregaService, PrismaService],
})
export class ItemEntregaModule {}
