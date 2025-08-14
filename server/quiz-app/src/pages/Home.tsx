// src/pages/Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Welcome to the Quiz App</h1>
      <button onClick={() => navigate("/host")}>Host Game</button>
      <button onClick={() => navigate("/join")}>Join Game</button>
    </div>
  );
};

export default Home;
