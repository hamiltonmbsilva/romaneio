import { Module } from '@nestjs/common'
import { RomaneioService } from './romaneio.service'
import { ItemRomaneioService } from './item-romaneio.service'
import { RomaneioController } from './romaneio.controller'
import { ItemRomaneioController } from './item-romaneio.controller'
import { PrismaService } from '../../shared/prisma/prisma.service'
import { GeocodingService } from '../../shared/services/geocoding.service'
import { RegiaoClienteService } from '../../shared/services/regiao-cliente.service'

@Module({
  controllers: [RomaneioController, ItemRomaneioController],
  providers: [RomaneioService, PrismaService, ItemRomaneioService, GeocodingService, RegiaoClienteService],
})
export class RomaneioModule {}


