-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Game" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pin" INTEGER NOT NULL,
    "hostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Choice" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Answer" (
    "id" TEXT NOT NULL,
    "choiceId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Choice" ADD CONSTRAINT "Choice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "public"."Choice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
