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

interface SquareInfo {
    pieceType?: string;
    isWhite?: boolean;
}

interface Game {
    id: number;
    name: string;
    password?: string;
    boardMap?: SquareInfo[][];
}

let games = [] as Game[];
let playerNumber = 0;

io.on("connection", (socket: Socket) => {
    socket.emit("player-number", playerNumber);
    console.log(`connection with number ${playerNumber}`);
    socket.emit("set-lobbies", games);
    playerNumber += 1;
    socket.on("create-lobby", (game) => {
        if (game.id == -1) {
            return;
        } else {
            games.push(game);
            socket.emit("set-lobbies", games);
        }
    });
    socket.on("refresh-lobbies", () => {
        socket.emit("set-lobbies", games);
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

httpServer.listen(PORT);
