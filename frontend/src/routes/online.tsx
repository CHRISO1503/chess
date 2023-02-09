import { useEffect, useState } from "react";
import LobbyMenu, { Lobby } from "../components/onlineMenu/lobbyMenu";
import OnlineGame from "../components/onlineGame";
import socketIOClient, { Socket } from "socket.io-client";
import Header from "../components/header";

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
            <Header />
            {inGame ? <OnlineGame lobby={lobby} socket={socket} /> : <></>}
            <LobbyMenu
                inGame={inGame}
                socket={socket}
                setSocket={setSocket}
                setLobby={setLobby}
            />
        </>
    );
}
