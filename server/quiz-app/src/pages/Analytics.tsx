// src/pages/Analytics.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

interface Player {
  name: string;
  points: number;
}

const Analytics: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    api.get(`/analytics/${sessionId}`).then((res) => {
      setPlayers(res.data.analytics);
    });
  }, [sessionId]);

  return (
    <div className="container">
      <h2>Analytics - Session {sessionId}</h2>
      <ul>
        {players.map((p, idx) => (
          <li key={idx}>
            {p.name}: {p.points} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Analytics;
