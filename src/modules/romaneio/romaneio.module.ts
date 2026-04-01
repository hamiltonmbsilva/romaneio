import { Module } from '@nestjs/common'
import { RomaneioService } from './romaneio.service'
import { ItemRomaneioService } from './item-romaneio.service'
import { RomaneioController } from './romaneio.controller'
import { ItemRomaneioController } from './item-romaneio.controller'
import { PrismaService } from '../../shared/prisma/prisma.service'

@Module({
  controllers: [RomaneioController, ItemRomaneioController],
  providers: [RomaneioService, PrismaService, ItemRomaneioService],
})
export class RomaneioModule {}


