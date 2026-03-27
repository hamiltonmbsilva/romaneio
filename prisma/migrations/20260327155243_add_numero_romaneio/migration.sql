-- CreateTable
CREATE TABLE "Veiculo" (
    "id" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "kmInicial" DOUBLE PRECISION NOT NULL,
    "kmFinal" DOUBLE PRECISION,
    "capacidadeKg" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Motorista" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "cnh" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "ativo" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Motorista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "nomeFantasia" TEXT,
    "telefone" TEXT,
    "contato" TEXT,
    "email" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "endereco" TEXT,
    "cep" TEXT,
    "bairro" TEXT,
    "inscricaoEstadual" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

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
    "romaneioId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "embalagemId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "observacao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',

    CONSTRAINT "ItemRomaneio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Romaneio" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "rota" TEXT,
    "motoristaId" TEXT NOT NULL,
    "veiculoId" TEXT NOT NULL,
    "dataSaida" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ABERTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Romaneio_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_placa_key" ON "Veiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_cnh_key" ON "Motorista"("cnh");

-- CreateIndex
CREATE UNIQUE INDEX "Romaneio_numero_key" ON "Romaneio"("numero");

-- AddForeignKey
ALTER TABLE "VeiculoKm" ADD CONSTRAINT "VeiculoKm_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embalagem" ADD CONSTRAINT "Embalagem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRomaneio" ADD CONSTRAINT "ItemRomaneio_romaneioId_fkey" FOREIGN KEY ("romaneioId") REFERENCES "Romaneio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRomaneio" ADD CONSTRAINT "ItemRomaneio_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRomaneio" ADD CONSTRAINT "ItemRomaneio_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRomaneio" ADD CONSTRAINT "ItemRomaneio_embalagemId_fkey" FOREIGN KEY ("embalagemId") REFERENCES "Embalagem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Romaneio" ADD CONSTRAINT "Romaneio_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Romaneio" ADD CONSTRAINT "Romaneio_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
