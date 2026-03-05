/*
  Warnings:

  - A unique constraint covering the columns `[documento]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cnh]` on the table `Motorista` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contatoCargo` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contatoNome` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documento` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "contatoCargo" TEXT NOT NULL,
ADD COLUMN     "contatoNome" TEXT NOT NULL,
ADD COLUMN     "documento" TEXT NOT NULL,
ADD COLUMN     "estado" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_documento_key" ON "Cliente"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_cnh_key" ON "Motorista"("cnh");
