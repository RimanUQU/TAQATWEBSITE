ALTER TABLE "StaffGroup"
ADD COLUMN "parentId" TEXT;

ALTER TABLE "StaffGroup"
ADD CONSTRAINT "StaffGroup_parentId_fkey"
FOREIGN KEY ("parentId") REFERENCES "StaffGroup"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "StaffGroup_parentId_displayOrder_idx"
ON "StaffGroup"("parentId", "displayOrder");
