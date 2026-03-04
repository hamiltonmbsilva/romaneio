import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VeiculoModule } from './modules/veiculo/veiculo.module';
import { PrismaModule } from './shared/prisma/prisma.module'

@Module({
  imports: [PrismaModule,VeiculoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
