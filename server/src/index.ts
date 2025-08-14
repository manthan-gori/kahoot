import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { PrismaClient, QuestionType } from "@prisma/client";
import { nanoid } from "nanoid";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/** -----------------
 * Create Quiz
 * ----------------- */
app.post("/quiz", async (req, res) => {
  try {
    const { title, questions } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            type: q.type
              ? (QuestionType[q.type.toUpperCase() as keyof typeof QuestionType])
              : QuestionType.MULTIPLE_CHOICE,
            choices: q.choices
              ? { create: q.choices.map((c: any) => ({ text: c.text, isCorrect: c.isCorrect })) }
              : undefined,
          })),
        },
      },
      include: { questions: { include: { choices: true } } },
    });

    res.json(quiz);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** -----------------
 * Start Game (Generate PIN)
 * ----------------- */
app.post("/start-game/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const pin = nanoid(6).toUpperCase();

    const session = await prisma.gameSession.create({
      data: { quizId, pin, startedAt: new Date() },
    });

    res.json({ sessionId: session.id, pin });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** -----------------
 * Player Join
 * ----------------- */
app.post("/join/:pin", async (req, res) => {
  try {
    const { pin } = req.params;
    const { name, avatar } = req.body;

    const session = await prisma.gameSession.findUnique({ where: { pin } });
    if (!session) return res.status(404).json({ error: "Game not found" });

    const player = await prisma.player.create({
      data: { name, avatar, sessionId: session.id },
    });

    io.to(pin).emit("playerJoined", { playerId: player.id, name: player.name, avatar });
    res.json(player);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** -----------------
 * Submit Answer
 * ----------------- */
app.post("/answer", async (req, res) => {
  try {
    const { playerId, choiceId, text, timeTaken } = req.body; // timeTaken in seconds
    let points = 0;

    let choice;
    if (choiceId) {
      choice = await prisma.choice.findUnique({ where: { id: choiceId } });
      if (!choice) return res.status(404).json({ error: "Choice not found" });
      if (choice.isCorrect) points = Math.max(0, 100 - Math.floor(timeTaken * 5));
    }

    const answer = await prisma.answer.create({
      data: { playerId, choiceId, text, points },
    });

    await prisma.player.update({
      where: { id: playerId },
      data: { points: { increment: points } },
    });

    // Emit leaderboard
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: { session: { include: { players: true, quiz: true } } },
    });

    if (player) {
      const leaderboard = player.session.players
        .map((p) => ({ name: p.name, avatar: p.avatar, points: p.points }))
        .sort((a, b) => b.points - a.points);

      io.to(player.session.pin).emit("leaderboardUpdate", leaderboard);
    }

    res.json({ answerId: answer.id, points });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** -----------------
 * Fetch All Quizzes
 * ----------------- */
app.get("/quiz", async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: { questions: { include: { choices: true } } },
    });
    res.json(quizzes);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/** -----------------
 * Analytics
 * ----------------- */
app.get("/analytics/:sessionId", async (req, res) => {
  const session = await prisma.gameSession.findUnique({
    where: { id: req.params.sessionId },
    include: { players: { include: { answers: { include: { choice: true } } } } },
  });

  if (!session) return res.status(404).json({ error: "Session not found" });

  const analytics = session.players.map((p) => ({
    name: p.name,
    avatar: p.avatar,
    points: p.points,
    answers: p.answers.map((a) => ({
      questionId: a.choice?.questionId,
      isCorrect: a.choice?.isCorrect ?? null,
      text: a.text ?? null,
      points: a.points,
      answeredAt: a.answeredAt,
    })),
  }));

  res.json({ sessionId: session.id, analytics });
});

/** -----------------
 * Socket.IO
 * ----------------- */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (pin: string) => {
    socket.join(pin);
    console.log(`Socket ${socket.id} joined room ${pin}`);
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

/** -----------------
 * Home
 * ----------------- */
app.get("/", (_, res) => res.send("🎯 Kahoot-like API running"));

server.listen(3000, () => console.log("Server running 🚀 on port 3000"));
