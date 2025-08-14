/*
  Warnings:

  - Added the required column `playerId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Answer" ADD COLUMN     "playerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
