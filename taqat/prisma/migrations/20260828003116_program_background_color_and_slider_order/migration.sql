-- AlterTable
ALTER TABLE "public"."Program" ADD COLUMN     "backgroundColor" TEXT NOT NULL DEFAULT '#075658',
ADD COLUMN     "sliderOrder" INTEGER NOT NULL DEFAULT 0;
