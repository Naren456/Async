/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedBy` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the `Assignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pdfUrl` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_uploadedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentSubject" DROP CONSTRAINT "StudentSubject_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentSubject" DROP CONSTRAINT "StudentSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subject" DROP CONSTRAINT "Subject_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Submission" DROP CONSTRAINT "Submission_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Submission" DROP CONSTRAINT "Submission_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Note" DROP COLUMN "fileUrl",
DROP COLUMN "uploadedBy",
ADD COLUMN     "pdfUrl" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Subject" DROP COLUMN "teacherId",
ADD COLUMN     "semester" INTEGER NOT NULL,
ADD COLUMN     "term" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "cohortId" TEXT,
ADD COLUMN     "semester" INTEGER,
ADD COLUMN     "term" INTEGER;

-- DropTable
DROP TABLE "public"."Assignment";

-- DropTable
DROP TABLE "public"."StudentSubject";

-- DropTable
DROP TABLE "public"."Submission";

-- DropTable
DROP TABLE "public"."Task";

-- CreateTable
CREATE TABLE "public"."Cohort" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_number_key" ON "public"."Cohort"("number");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "public"."Cohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;
