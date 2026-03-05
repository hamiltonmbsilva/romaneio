-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Embalagem" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "unidades" INTEGER NOT NULL,
    "pesoUnitarioKg" DOUBLE PRECISION NOT NULL,
    "produtoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Embalagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemRomaneio" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "embalagemId" TEXT NOT NULL,
    "romaneioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemRomaneio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Embalagem" ADD CONSTRAINT "Embalagem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRomaneio" ADD CONSTRAINT "ItemRomaneio_embalagemId_fkey" FOREIGN KEY ("embalagemId") REFERENCES "Embalagem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
