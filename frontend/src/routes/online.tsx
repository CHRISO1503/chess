import { useEffect, useState } from "react";
import LobbyMenu, { Lobby } from "./lobbyMenu";
import OnlineGame from "./onlineGame";
import socketIOClient, { Socket } from "socket.io-client";

export default function Online() {
    const [inGame, setInGame] = useState(false);
    const [socket, setSocket] = useState(socketIOClient());
    const [lobby, setLobby] = useState({ id: "", name: "" } as Lobby);

    useEffect(() => {
        if (lobby.id != "") {
            setInGame(true);
        }
    }, [lobby]);

    return (
        <>
            {inGame ? (
                <OnlineGame lobby={lobby} socket={socket} />
            ) : (
                <LobbyMenu
                    socket={socket}
                    setSocket={setSocket}
                    setLobby={setLobby}
                />
            )}
        </>
    );
}
