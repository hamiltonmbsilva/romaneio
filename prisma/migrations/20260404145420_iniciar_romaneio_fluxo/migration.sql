-- AlterTable
ALTER TABLE "ItemRomaneio" ADD COLUMN     "distanciaClienteKm" DOUBLE PRECISION,
ADD COLUMN     "numeroNF" TEXT,
ADD COLUMN     "ordemEntrega" INTEGER;

-- AlterTable
ALTER TABLE "Romaneio" ADD COLUMN     "dataInicio" TIMESTAMP(3),
ADD COLUMN     "distanciaPrevistaKm" DOUBLE PRECISION,
ADD COLUMN     "kmRetorno" DOUBLE PRECISION,
ADD COLUMN     "kmSaida" DOUBLE PRECISION,
ADD COLUMN     "tempoPrevistoMin" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'AGUARDANDO';

-- AlterTable
ALTER TABLE "VeiculoKm" ADD COLUMN     "romaneioId" TEXT;
