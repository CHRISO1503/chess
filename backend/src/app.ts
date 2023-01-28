import express from "express";
import path from "path";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import router from "./routes";
const app = express();
app.use(cors());
const PORT = 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: true } });

io.on("connection", (socket: Socket) => {
    console.log(`New connection from socket ${socket}`);
    socket.emit("hello", "world");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

httpServer.listen(5000);
