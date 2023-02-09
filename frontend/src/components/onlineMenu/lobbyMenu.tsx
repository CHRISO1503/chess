import { useEffect, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import LobbyList from "./lobbyList";
import LobbyOptions from "./lobbyOptions";
import { deployed } from "../../appSettings";
import { SquareInfo } from "../game/game";
import LobbyPasswordPopup from "./lobbyPasswordPopup";
import AwaitingChallengerPopup from "./awaitingChallengerPopup";

export interface Lobby {
    id: string;
    name: string;
    password?: string;
    boardMap?: SquareInfo[][];
    opponentId?: string;
    hostIsWhite?: boolean;
}

const ENDPOINT = deployed
    ? "https://chess-backend-b9b8.onrender.com"
    : "http://localhost:5000";

export default function LobbyMenu({
    inGame,
    socket,
    setSocket,
    setLobby,
}: {
    inGame: boolean;
    socket: Socket;
    setSocket: (value: Socket) => void;
    setLobby: (value: Lobby) => void;
}) {
    const [newLobby, setNewLobby] = useState({
        id: "",
        name: "",
    } as Lobby);
    const [joinLobby, setJoinLobby] = useState({ id: "", name: "" } as Lobby);
    const [playerId, setPlayerId] = useState("");
    const [lobbyList, setLobbyList] = useState([] as Lobby[]);
    const [requirePassword, setRequirePassword] = useState(false);
    const [awaitingChallenger, setAwaitingChallenger] = useState(false);
    const [connected, setConnected] = useState(false);

    // Connect to server
    useEffect(() => {
        if (playerId == "") {
            const socket = socketIOClient(ENDPOINT);
            setPlayerId(socket.id);
            socket.on("connect", () => setConnected(true));
            socket.on("connect_error", () => setConnected(false));
            socket.on("set-lobbies", (lobbies) => {
                setLobbyList(lobbies);
            });
            socket.on("created-lobby", (lobby) => {
                setAwaitingChallenger(false);
                setLobby(lobby);
            });
            setSocket(socket);
        }
    }, []);

    // Create a lobby
    useEffect(() => {
        socket.emit("create-lobby", {
            id: socket.id,
            name: newLobby.name,
            password: newLobby.password,
        });
    }, [newLobby]);

    // Join a lobby
    useEffect(() => {
        if (joinLobby.id != "") {
            if (joinLobby.password) {
                setRequirePassword(true);
            } else {
                enterLobby();
            }
        }
    }, [joinLobby]);

    function enterLobby() {
        if (joinLobby.id == socket.id) {
            setAwaitingChallenger(true);
        } else {
            socket.emit("join-lobby", joinLobby.id, socket.id);
        }
    }

    return (
        <>
            {!inGame && connected ? (
                <div>
                    <div
                        className={
                            requirePassword || awaitingChallenger
                                ? "blur-content"
                                : ""
                        }
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <div style={{ width: "30vw" }}>
                                <LobbyOptions
                                    setNewLobby={setNewLobby}
                                    socket={socket}
                                    setJoinLobby={setJoinLobby}
                                />
                            </div>
                            <div style={{ width: "30vw" }}>
                                <LobbyList
                                    lobbyList={lobbyList}
                                    socket={socket}
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
                    {awaitingChallenger ? <AwaitingChallengerPopup /> : <></>}
                </div>
            ) : connected ? (
                <></>
            ) : (
                <div>
                    Connecting to the server... If this takes more than one
                    minute, you may need to refresh the page.
                </div>
            )}
        </>
    );
}
