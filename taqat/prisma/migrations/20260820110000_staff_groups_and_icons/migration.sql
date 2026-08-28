CREATE TABLE "StaffGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StaffGroup_pkey" PRIMARY KEY ("id")
);

INSERT INTO "StaffGroup" ("id", "displayOrder", "updatedAt")
VALUES ('legacy-staff-group', 1, CURRENT_TIMESTAMP);

ALTER TABLE "StaffMember"
  ADD COLUMN "icon" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "groupId" TEXT NOT NULL DEFAULT 'legacy-staff-group';

ALTER TABLE "StaffMember"
  DROP COLUMN "image",
  DROP COLUMN "bio",
  DROP COLUMN "contactUrl";

ALTER TABLE "StaffMember"
  ADD CONSTRAINT "StaffMember_groupId_fkey"
  FOREIGN KEY ("groupId") REFERENCES "StaffGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "StaffMember_groupId_displayOrder_idx" ON "StaffMember"("groupId", "displayOrder");
