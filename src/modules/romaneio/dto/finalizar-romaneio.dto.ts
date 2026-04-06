import { IsNumber } from 'class-validator'

export class FinalizarRomaneioDTO {
  @IsNumber()
  kmRetorno!: number
}