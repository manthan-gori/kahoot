// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HostGame from "./pages/HostGame";
import JoinGame from "./pages/JoinGame";
import Lobby from "./pages/Lobby";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/host" element={<HostGame />} />
      <Route path="/join" element={<JoinGame />} />
      <Route path="/lobby/:sessionId" element={<Lobby />} />
      <Route path="/analytics/:sessionId" element={<Analytics />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default App;
