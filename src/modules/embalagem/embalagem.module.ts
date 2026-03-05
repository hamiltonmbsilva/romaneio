import { Module } from '@nestjs/common';
import { EmbalagemController } from './embalagem.controller';
import { EmbalagemService } from './embalagem.service';

@Module({
  controllers: [EmbalagemController],
  providers: [EmbalagemService]
})
export class EmbalagemModule {}
