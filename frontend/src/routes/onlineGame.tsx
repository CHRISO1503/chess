import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lobby } from "./lobbyMenu";
import socketIOClient, { Socket } from "socket.io-client";

export default function OnlineGame({
    lobby,
    socket,
}: {
    lobby: Lobby;
    socket: Socket;
}) {
    return <></>;
}
