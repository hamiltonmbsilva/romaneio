/*
  Warnings:

  - A unique constraint covering the columns `[placa]` on the table `Veiculo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_placa_key" ON "Veiculo"("placa");
