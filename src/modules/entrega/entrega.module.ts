import { Module } from '@nestjs/common'
import { EntregaService } from './entrega.service'
import { EntregaController } from './entrega.controller'
import { PrismaService } from '../../shared/prisma/prisma.service'

@Module({
  controllers: [EntregaController],
  providers: [EntregaService, PrismaService],
})
export class EntregaModule {}
