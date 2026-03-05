import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VeiculoModule } from './modules/veiculo/veiculo.module';
import { PrismaModule } from './shared/prisma/prisma.module'
import { MotoristaModule } from './modules/motorista/motorista.module';
import { ClienteModule } from './modules/cliente/cliente.module';

@Module({
  imports: [PrismaModule,VeiculoModule, MotoristaModule, ClienteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
