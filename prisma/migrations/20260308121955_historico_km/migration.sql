-- CreateTable
CREATE TABLE "VeiculoKm" (
    "id" TEXT NOT NULL,
    "veiculoId" TEXT NOT NULL,
    "kmSaida" INTEGER NOT NULL,
    "kmRetorno" INTEGER,
    "kmRodado" INTEGER,
    "dataSaida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRetorno" TIMESTAMP(3),

    CONSTRAINT "VeiculoKm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VeiculoKm" ADD CONSTRAINT "VeiculoKm_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
