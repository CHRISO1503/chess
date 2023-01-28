import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
const app = express();
const PORT = 5000;
const server = http.createServer(app);
const io = new Server(server);

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});

app.get("/", (req, res) => {
    res.send(`Hello from PORT ${PORT}`);
});

io.on("connection", (socket) =>
    console.log(`New connection from socket ${socket}`)
);
