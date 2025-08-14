/*
  Warnings:

  - You are about to drop the column `quizId` on the `Player` table. All the data in the column will be lost.
  - Added the required column `points` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Player" DROP CONSTRAINT "Player_quizId_fkey";

-- AlterTable
ALTER TABLE "public"."Answer" ADD COLUMN     "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "points" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Player" DROP COLUMN "quizId",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'multiple-choice';

-- CreateTable
CREATE TABLE "public"."GameSession" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameSession_pin_key" ON "public"."GameSession"("pin");

-- AddForeignKey
ALTER TABLE "public"."GameSession" ADD CONSTRAINT "GameSession_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Player" ADD CONSTRAINT "Player_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."GameSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
