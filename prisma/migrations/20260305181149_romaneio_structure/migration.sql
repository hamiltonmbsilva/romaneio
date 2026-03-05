/*
  Warnings:

  - You are about to drop the `ProdutoRomaneio` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProdutoRomaneio" DROP CONSTRAINT "ProdutoRomaneio_romaneioId_fkey";

-- AlterTable
ALTER TABLE "Romaneio" ADD COLUMN     "dataFim" TIMESTAMP(3);

-- DropTable
DROP TABLE "ProdutoRomaneio";

-- CreateTable
CREATE TABLE "Entrega" (
    "id" TEXT NOT NULL,
    "romaneioId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "dataEntrega" TIMESTAMP(3),
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemEntrega" (
    "id" TEXT NOT NULL,
    "entregaId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "embalagemId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "ItemEntrega_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_romaneioId_fkey" FOREIGN KEY ("romaneioId") REFERENCES "Romaneio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemEntrega" ADD CONSTRAINT "ItemEntrega_entregaId_fkey" FOREIGN KEY ("entregaId") REFERENCES "Entrega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemEntrega" ADD CONSTRAINT "ItemEntrega_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemEntrega" ADD CONSTRAINT "ItemEntrega_embalagemId_fkey" FOREIGN KEY ("embalagemId") REFERENCES "Embalagem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
