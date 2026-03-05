import { Module } from '@nestjs/common'
import { RomaneioService } from './romaneio.service'
import { RomaneioController } from './romaneio.controller'
import { PrismaService } from '../../shared/prisma/prisma.service'

@Module({
  controllers: [RomaneioController],
  providers: [RomaneioService, PrismaService],
})
export class RomaneioModule {}
