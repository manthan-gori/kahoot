-- AlterTable
ALTER TABLE "public"."Player" ADD COLUMN     "quizId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Player" ADD CONSTRAINT "Player_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;
