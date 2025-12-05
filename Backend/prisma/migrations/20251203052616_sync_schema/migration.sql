/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Note` table. All the data in the column will be lost.
  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Subject` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectCode` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_subjectId_fkey";

-- DropIndex
DROP INDEX "public"."Subject_code_key";

-- AlterTable
ALTER TABLE "public"."Note" DROP COLUMN "subjectId",
ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "subjectCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Subject" DROP CONSTRAINT "Subject_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "cohortNo" DROP NOT NULL,
ALTER COLUMN "semester" DROP NOT NULL,
ALTER COLUMN "semester" SET DEFAULT 1,
ALTER COLUMN "term" DROP NOT NULL,
ALTER COLUMN "term" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "public"."Assignment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "cohortNo" INTEGER NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cohort" (
    "cohortNo" SERIAL NOT NULL,
    "semester" INTEGER NOT NULL,
    "term" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("cohortNo")
);

-- CreateTable
CREATE TABLE "public"."UserAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_title_cohortNo_subjectCode_key" ON "public"."Assignment"("title", "cohortNo", "subjectCode");

-- CreateIndex
CREATE UNIQUE INDEX "UserAssignment_userId_assignmentId_key" ON "public"."UserAssignment"("userId", "assignmentId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_cohortNo_fkey" FOREIGN KEY ("cohortNo") REFERENCES "public"."Cohort"("cohortNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_cohortNo_fkey" FOREIGN KEY ("cohortNo") REFERENCES "public"."Cohort"("cohortNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_subjectCode_fkey" FOREIGN KEY ("subjectCode") REFERENCES "public"."Subject"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_subjectCode_fkey" FOREIGN KEY ("subjectCode") REFERENCES "public"."Subject"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAssignment" ADD CONSTRAINT "UserAssignment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAssignment" ADD CONSTRAINT "UserAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
