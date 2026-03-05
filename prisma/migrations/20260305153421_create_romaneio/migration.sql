/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ItemRomaneio` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `dataAgendamento` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `numeroNF` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `rota` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `ticket` on the `Romaneio` table. All the data in the column will be lost.
  - You are about to drop the column `totalPeso` on the `Romaneio` table. All the data in the column will be lost.
  - Added the required column `clienteId` to the `ItemRomaneio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `produtoId` to the `ItemRomaneio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataSaida` to the `Romaneio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ItemRomaneio" DROP COLUMN "createdAt",
ADD COLUMN     "clienteId" TEXT NOT NULL,
ADD COLUMN     "observacao" TEXT,
ADD COLUMN     "produtoId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDENTE';

-- AlterTable
ALTER TABLE "Romaneio" DROP COLUMN "data",
DROP COLUMN "dataAgendamento",
DROP COLUMN "numero",
DROP COLUMN "numeroNF",
DROP COLUMN "rota",
DROP COLUMN "ticket",
DROP COLUMN "totalPeso",
ADD COLUMN     "dataSaida" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ABERTO';

-- AddForeignKey
ALTER TABLE "ItemRomaneio" ADD CONSTRAINT "ItemRomaneio_romaneioId_fkey" FOREIGN KEY ("romaneioId") REFERENCES "Romaneio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRomaneio" ADD CONSTRAINT "ItemRomaneio_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRomaneio" ADD CONSTRAINT "ItemRomaneio_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
