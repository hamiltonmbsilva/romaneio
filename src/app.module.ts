import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VeiculoModule } from './modules/veiculo/veiculo.module';
import { PrismaModule } from './shared/prisma/prisma.module'
import { MotoristaModule } from './modules/motorista/motorista.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { ProdutoModule } from './modules/produto/produto.module';
import { EmbalagemModule } from './modules/embalagem/embalagem.module';

@Module({
  imports: [PrismaModule,VeiculoModule, MotoristaModule, ClienteModule, ProdutoModule, EmbalagemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
