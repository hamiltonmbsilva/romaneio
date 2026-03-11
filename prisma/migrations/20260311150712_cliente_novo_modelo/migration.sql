/*
  Warnings:

  - You are about to drop the column `bairro` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `contatoCargo` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `contatoNome` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `documento` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `rua` on the `Cliente` table. All the data in the column will be lost.
  - Added the required column `ativo` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cliente_documento_key";

-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "bairro",
DROP COLUMN "contatoCargo",
DROP COLUMN "contatoNome",
DROP COLUMN "documento",
DROP COLUMN "numero",
DROP COLUMN "rua",
ADD COLUMN     "ativo" BOOLEAN NOT NULL,
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "contato" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "endereco" TEXT NOT NULL,
ADD COLUMN     "inscricaoEstadual" TEXT,
ALTER COLUMN "telefone" DROP NOT NULL;
