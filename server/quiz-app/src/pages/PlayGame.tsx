// src/pages/PlayGame.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { socket, api } from "../api";

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface Player {
  id: string;
  name: string;
  points: number;
}

const PlayGame: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId") || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  useEffect(() => {
    // Connect to socket room
    socket.connect();
    socket.emit("joinRoom", sessionId);

    // Fetch questions from backend
    api.get(`/game/${sessionId}/questions`).then((res) => {
      setQuestions(res.data.questions);
    });

    // Listen to leaderboard updates
    socket.on("leaderboardUpdate", (players: Player[]) => {
      setLeaderboard(players);
    });

    return () => {
      socket.off("leaderboardUpdate");
      socket.disconnect();
    };
  }, [sessionId]);

  const submitAnswer = () => {
    if (!selectedOption) return;

    const question = questions[currentIndex];
    socket.emit("submitAnswer", {
      sessionId,
      questionId: question.id,
      answer: selectedOption,
    });

    setSelectedOption("");
    setCurrentIndex((prev) => prev + 1);
  };

  if (questions.length === 0) return <p>Loading questions...</p>;
  if (currentIndex >= questions.length) return <p>Quiz finished!</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="container">
      <h2>Question {currentIndex + 1}</h2>
      <p>{currentQuestion.question}</p>

      {currentQuestion.options.map((opt) => (
        <div key={opt}>
          <input
            type="radio"
            id={opt}
            name="option"
            value={opt}
            checked={selectedOption === opt}
            onChange={() => setSelectedOption(opt)}
          />
          <label htmlFor={opt}>{opt}</label>
        </div>
      ))}

      <button onClick={submitAnswer} disabled={!selectedOption}>
        Submit
      </button>

      <h3>Leaderboard</h3>
      <ul>
        {leaderboard.map((p) => (
          <li key={p.id}>
            {p.name}: {p.points} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayGame;
