-- CreateTable
CREATE TABLE "TargetAudience" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TargetAudience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TargetAudience_name_key" ON "TargetAudience"("name");

-- Seed initial rows (fixed ids since this is a raw-SQL migration, not the Prisma client)
INSERT INTO "TargetAudience" ("id", "name") VALUES
  ('seed-audience-girls', 'فئة الفتيات'),
  ('seed-audience-university', 'فئة الجامعة'),
  ('seed-audience-highschool', 'فئة الثانوي');

-- AlterTable
ALTER TABLE "Program"
  ADD COLUMN "bannerImage" TEXT,
  ADD COLUMN "targetAudienceId" TEXT;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_targetAudienceId_fkey"
  FOREIGN KEY ("targetAudienceId") REFERENCES "TargetAudience"("id") ON DELETE SET NULL ON UPDATE CASCADE;
