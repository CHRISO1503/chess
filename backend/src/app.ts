import express from "express";
import path from "path";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
const app = express();
app.use(cors());
const PORT = 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: true } });

interface Player {
    playerIndex: number;
    game: Game;
}
interface Game {
    id: string;
    pass: string;
}

let players = [] as Player[];

io.on("connection", (socket: Socket) => {
    let playerIndex = players.length;
    players.push({ playerIndex: playerIndex, game: { id: "", pass: "" } });
    socket.emit("player-number", playerIndex);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

httpServer.listen(5000);
