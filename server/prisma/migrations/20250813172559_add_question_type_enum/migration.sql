/*
  Warnings:

  - The `type` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'PUZZLE', 'POLL', 'OPEN_ENDED');

-- DropForeignKey
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_choiceId_fkey";

-- AlterTable
ALTER TABLE "public"."Answer" ADD COLUMN     "text" TEXT,
ALTER COLUMN "choiceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Question" DROP COLUMN "type",
ADD COLUMN     "type" "public"."QuestionType" NOT NULL DEFAULT 'MULTIPLE_CHOICE';

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "public"."Choice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
