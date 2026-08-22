-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "ProgramStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "RegistrationStatus" AS ENUM ('CONFIRMED', 'CANCELLED', 'WAITLIST');
CREATE TYPE "CommentStatus" AS ENUM ('PENDING', 'APPROVED', 'HIDDEN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "phone" TEXT, "avatar" TEXT,
    "passwordHash" TEXT NOT NULL, "role" "Role" NOT NULL DEFAULT 'USER', "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ProgramCategory" (
    "id" TEXT NOT NULL, "name" TEXT NOT NULL, "slug" TEXT NOT NULL,
    CONSTRAINT "ProgramCategory_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Program" (
    "id" TEXT NOT NULL, "title" TEXT NOT NULL, "slug" TEXT NOT NULL, "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL, "coverImage" TEXT NOT NULL, "cardImage" TEXT NOT NULL, "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL, "endDate" TIMESTAMP(3) NOT NULL, "registrationDeadline" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL, "price" DOUBLE PRECISION NOT NULL DEFAULT 0, "status" "ProgramStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false, "showInSlider" BOOLEAN NOT NULL DEFAULT false, "isNew" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, "categoryId" TEXT,
    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ProgramRegistration" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "programId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'CONFIRMED', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProgramRegistration_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ProgramComment" (
    "id" TEXT NOT NULL, "body" TEXT NOT NULL, "status" "CommentStatus" NOT NULL DEFAULT 'PENDING', "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProgramComment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL, "name" TEXT NOT NULL, "logo" TEXT NOT NULL, "url" TEXT, "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL, "quote" TEXT NOT NULL, "name" TEXT NOT NULL, "title" TEXT, "rating" INTEGER NOT NULL DEFAULT 5,
    "displayOrder" INTEGER NOT NULL DEFAULT 0, "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "StaffMember" (
    "id" TEXT NOT NULL, "name" TEXT NOT NULL, "jobTitle" TEXT NOT NULL, "image" TEXT NOT NULL, "bio" TEXT, "contactUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0, "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StaffMember_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Statistic" (
    "id" TEXT NOT NULL, "title" TEXT NOT NULL, "value" INTEGER NOT NULL, "prefix" TEXT, "suffix" TEXT, "icon" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0, "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Statistic_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL, "value" TEXT NOT NULL, "group" TEXT NOT NULL DEFAULT 'general', "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);
CREATE TABLE "AboutContent" (
    "id" TEXT NOT NULL DEFAULT 'main', "introduction" TEXT NOT NULL, "vision" TEXT NOT NULL, "mission" TEXT NOT NULL,
    "goals" TEXT NOT NULL, "values" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AboutContent_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "userId" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "usedAt" TIMESTAMP(3),
    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "ProgramCategory_name_key" ON "ProgramCategory"("name");
CREATE UNIQUE INDEX "ProgramCategory_slug_key" ON "ProgramCategory"("slug");
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");
CREATE INDEX "ProgramRegistration_programId_status_idx" ON "ProgramRegistration"("programId", "status");
CREATE UNIQUE INDEX "ProgramRegistration_userId_programId_key" ON "ProgramRegistration"("userId", "programId");
CREATE INDEX "ProgramComment_programId_status_idx" ON "ProgramComment"("programId", "status");
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProgramCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProgramRegistration" ADD CONSTRAINT "ProgramRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProgramRegistration" ADD CONSTRAINT "ProgramRegistration_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProgramComment" ADD CONSTRAINT "ProgramComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProgramComment" ADD CONSTRAINT "ProgramComment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
