// src/socket.ts
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000"); // change port if backend is different
