import express from "express";
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
    hostIsWhite?: boolean;
}

let games = [] as Game[];

io.on("connection", (socket: Socket) => {
    removeGame(socket);
    socket.emit("set-lobbies", games);
    socket.on("create-lobby", (game) => {
        if (game.id == -1) {
            return;
        } else {
            removeGame(socket);
            games.push(game);
            socket.emit("set-lobbies", games);
        }
    });
    socket.on("refresh-lobbies", () => {
        socket.emit("set-lobbies", games);
    });
    socket.on("disconnect", () => {
        removeGame(socket);
    });
    socket.on("join-lobby", (lobbyId, playerNumber) => {
        let index = games.findIndex((x) => x.id == lobbyId);
        if (index != -1) {
            games[index].opponentId = playerNumber;
            Math.round(Math.random()) === 1
                ? (games[index].hostIsWhite = true)
                : (games[index].hostIsWhite = false);
            // Let host and current client (joiner) know lobby is created
            socket.to(games[index].id).emit("created-lobby", games[index]);
            socket.emit("created-lobby", games[index]);
        }
    });
    socket.on("turn-ended", (lobby, boardMap, clickedSquare) => {
        lobby.boardMap = boardMap;
        let emittee = "";
        let isWhitesTurn = false;
        if (lobby.id == socket.id) {
            emittee = lobby.opponentId;
            isWhitesTurn = !lobby.hostIsWhite;
        } else {
            emittee = lobby.id;
            isWhitesTurn = lobby.hostIsWhite;
        }
        socket
            .to(emittee)
            .emit("begin-turn", lobby, isWhitesTurn, clickedSquare);
    });
    socket.on("kings-moved", (lobby, kingsMoved) => {
        sendOtherPlayerState(lobby, socket, kingsMoved, "update-kings-moved");
    });
    socket.on("rooks-moved", (lobby, rooksMoved) => {
        sendOtherPlayerState(lobby, socket, rooksMoved, "update-rooks-moved");
    });
    socket.on("passant", (lobby, passant) => {
        sendOtherPlayerState(lobby, socket, passant, "update-passant");
    });
});

function removeGame(socket: Socket) {
    let index = games.findIndex((x) => x.id == socket.id);
    if (index != -1) {
        games.splice(index, 1);
    }
}

function sendOtherPlayerState(
    lobby: Game,
    socket: Socket,
    state: any,
    emitName: string
) {
    let emittee = "";
    console.log(socket.id, lobby.id, lobby.opponentId);
    if (lobby.opponentId) {
        if (lobby.id == socket.id) {
            emittee = lobby.opponentId;
        } else {
            emittee = lobby.id;
        }
        console.log(emittee)
    }
    socket.to(emittee).emit(emitName, state);
}

httpServer.listen(PORT);
