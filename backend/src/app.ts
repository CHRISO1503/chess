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
    id: string;
    name: string;
    password?: string;
    boardMap?: SquareInfo[][];
    opponentId?: string;
}

let games = [] as Game[];

io.on("connection", (socket: Socket) => {
    socket.emit("set-lobbies", games);
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
        removeGame(socket);
        console.log("Client disconnected");
    });
    socket.on("join-lobby", (lobbyId, playerNumber) => {
        let index = games.findIndex((x) => x.id == lobbyId);
        if (index != -1) {
            games[index].opponentId = playerNumber;
            // Let host and current client (joiner) know lobby is created
            socket.to(games[index].id).emit("created-lobby", games[index]);
            socket.emit("created-lobby", games[index]);
        }
    });
});

function removeGame(socket: Socket) {
    let index = games.findIndex((x) => x.id == socket.id);
    if (index != -1) {
        games.splice(index, 1);
    }
}

httpServer.listen(PORT);
