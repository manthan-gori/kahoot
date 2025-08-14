/*
  Warnings:

  - You are about to drop the column `playerId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quizId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_playerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_hostId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Player" DROP CONSTRAINT "Player_gameId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_gameId_fkey";

-- AlterTable
ALTER TABLE "public"."Answer" DROP COLUMN "playerId";

-- AlterTable
ALTER TABLE "public"."Question" DROP COLUMN "gameId",
ADD COLUMN     "quizId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Game";

-- DropTable
DROP TABLE "public"."Player";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Quiz" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
