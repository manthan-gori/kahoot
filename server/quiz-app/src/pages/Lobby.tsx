// src/pages/JoinGame.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, socket } from "../api";

const JoinGame: React.FC = () => {
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const joinGame = async () => {
    if (!pin || !name) return;
    const res = await api.post(`/join/${pin}`, { name, avatar: "" });
    const playerId = res.data.id;
    socket.connect();
    socket.emit("joinRoom", pin);
    navigate(`/lobby/${pin}`);
  };

  return (
    <div className="container">
      <h2>Join Game</h2>
      <input
        type="text"
        placeholder="Game PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={joinGame}>Join</button>
    </div>
  );
};

export default JoinGame;
