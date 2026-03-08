import { Module } from "@nestjs/common"
import { VeiculoKmService } from "./veiculo-km.service"
import { VeiculoKmController } from "./veiculo-km.controller"

@Module({

 controllers:[VeiculoKmController],
 providers:[VeiculoKmService]

})
export class VeiculoKmModule{}