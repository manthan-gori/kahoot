// src/pages/HostGame.tsx
import React, { useEffect, useState } from "react";
import { api } from "../api";       // ✅ API from api.ts
import { socket } from "../socket"; // ✅ Socket from socket.ts


interface Quiz {
  id: string;
  title: string;
}

const HostGame: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    api.get<Quiz[]>("/quiz")
      .then((res) => {
        setQuizzes(res.data);
      })
      .catch((err) => {
        console.error("Error fetching quizzes:", err);
      });
  }, []);

  const startGame = () => {
    if (!selectedQuiz) {
      alert("Please select a quiz first!");
      return;
    }

    api.post<{ pin: string; sessionId: string }>(`/start-game/${selectedQuiz}`)
      .then((res) => {
        setPin(res.data.pin);
        socket.emit("host-joined", res.data.sessionId);
      })
      .catch((err) => {
        console.error("Error starting game:", err);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Host a Game</h2>

      <label>Select a Quiz: </label>
      <select
        value={selectedQuiz}
        onChange={(e) => setSelectedQuiz(e.target.value)}
      >
        <option value="">-- Select --</option>
        {quizzes.map((quiz) => (
          <option key={quiz.id} value={quiz.id}>
            {quiz.title}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={startGame}>Start Game</button>

      {pin && (
        <div style={{ marginTop: "20px" }}>
          <h3>Game PIN: {pin}</h3>
          <p>Share this PIN with players so they can join!</p>
        </div>
      )}
    </div>
  );
};

export default HostGame;
