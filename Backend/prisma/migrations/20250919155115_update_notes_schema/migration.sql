/*
  Warnings:

  - You are about to drop the column `cohortId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Cohort` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `cohortNo` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `semester` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `term` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_cohortId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "cohortId",
ALTER COLUMN "cohortNo" SET NOT NULL,
ALTER COLUMN "semester" SET NOT NULL,
ALTER COLUMN "term" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Cohort";
