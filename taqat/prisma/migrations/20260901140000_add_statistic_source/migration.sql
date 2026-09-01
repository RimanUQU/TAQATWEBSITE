-- CreateEnum
CREATE TYPE "StatisticSource" AS ENUM ('MANUAL', 'BENEFICIARIES', 'PARTNERS', 'PROGRAMS', 'SATISFACTION');

-- AlterTable
ALTER TABLE "Statistic" ADD COLUMN "source" "StatisticSource" NOT NULL DEFAULT 'MANUAL';
