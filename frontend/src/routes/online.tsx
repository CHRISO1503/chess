import { useEffect, useState } from "react";
import socketIOClient, { io, Socket } from "socket.io-client";
import Header from "../components/header";
import LobbyList from "../components/lobbyList";
import LobbyOptions from "../components/lobbyOptions";
import { deployed } from "../appSettings";
import { SquareInfo } from "../components/game/game";
import LobbyPasswordPopup from "../components/lobbyPasswordPopup";

export interface Lobby {
    id: number;
    name: string;
    password?: string;
    boardMap?: SquareInfo[][];
}

const ENDPOINT = deployed ? "" : "http://localhost:5000";

export default function Online() {
    const [newLobby, setNewLobby] = useState({
        id: -1,
        name: "",
    } as Lobby);
    const [joinLobby, setJoinLobby] = useState({ id: -1, name: "" } as Lobby);
    const [playerNumber, setPlayerNumber] = useState(-1);
    const [socket, setSocket] = useState(socketIOClient());
    const [lobbyList, setLobbyList] = useState([] as Lobby[]);
    const [requirePassword, setRequirePassword] = useState(false);

    // Connect to server
    useEffect(() => {
        if (playerNumber == -1) {
            const socket = socketIOClient(ENDPOINT);
            socket.on("player-number", (playerNumber) => {
                setPlayerNumber(playerNumber);
                console.log(playerNumber);
            });
            socket.on("set-lobbies", (lobbies) => {
                setLobbyList(lobbies);
                console.log(lobbies);
            });
            socket.on("connect", () => console.log("Connected to server"));
            setSocket(socket);
        }
    }, []);

    useEffect(() => {
        socket.emit("create-lobby", {
            id: playerNumber,
            name: newLobby.name,
            password: newLobby.password,
        });
        console.log(`creating lobby with playernumber ${playerNumber}`);
    }, [newLobby]);

    useEffect(() => {
        if (joinLobby.id != -1) {
            if (joinLobby.password) {
                setRequirePassword(true);
            } else {
                enterLobby();
            }
        }
    }, [joinLobby]);

    function enterLobby() {
        //Join the joinlobby
        console.log("Joining lobby", joinLobby);
        // if lobby has no players in then await challenge with socket.on("challenge-accepted") <- send only 
    }

    return (
        <>
            <div className={requirePassword ? "blur-content" : ""}>
                <Header />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "30vw" }}>
                        <LobbyList
                            lobbyList={lobbyList}
                            socket={socket}
                            setJoinLobby={setJoinLobby}
                        />
                    </div>
                    <div style={{ width: "30vw" }}>
                        <LobbyOptions
                            setNewLobby={setNewLobby}
                            playerNumber={playerNumber}
                            setJoinLobby={setJoinLobby}
                        />
                    </div>
                </div>
            </div>
            {requirePassword ? (
                <LobbyPasswordPopup
                    enterLobby={enterLobby}
                    setRequirePassword={setRequirePassword}
                />
            ) : (
                <></>
            )}
        </>
    );
}
