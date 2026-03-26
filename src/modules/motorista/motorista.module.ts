import { Module } from '@nestjs/common';
import { MotoristaController } from './motorista.controller';
import { MotoristaService } from './motorista.service';
import { PrismaService } from "src/shared/prisma/prisma.service"

@Module({
  controllers: [MotoristaController],
  providers: [MotoristaService, PrismaService]
})
export class MotoristaModule {}
