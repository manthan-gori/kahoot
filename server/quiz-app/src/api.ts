import axios from "axios";
import { io } from "socket.io-client";

export const API_URL = "http://localhost:5000"; // change to your backend URL

export const api = axios.create({
  baseURL: API_URL,
});

// Create socket connection
export const socket = io(API_URL, {
  transports: ["websocket"],
});
