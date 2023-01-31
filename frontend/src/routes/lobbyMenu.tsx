import { useEffect, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import Header from "../components/header";
import LobbyList from "../components/lobbyList";
import LobbyOptions from "../components/lobbyOptions";
import { deployed } from "../appSettings";
import { SquareInfo } from "../components/game/game";
import LobbyPasswordPopup from "../components/lobbyPasswordPopup";
import AwaitingChallengerPopup from "../components/awaitingChallengerPopup";

export interface Lobby {
    id: string;
    name: string;
    password?: string;
    boardMap?: SquareInfo[][];
    opponentId?: string;
}

const ENDPOINT = deployed ? "" : "http://localhost:5000";

export default function LobbyMenu({
    socket,
    setSocket,
    setLobby,
}: {
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

    // Connect to server
    useEffect(() => {
        if (playerId == "") {
            const socket = socketIOClient(ENDPOINT);
            setPlayerId(socket.id);
            socket.on("connect", () => console.log("Connected to server"));
            socket.on("set-lobbies", (lobbies) => {
                setLobbyList(lobbies);
                console.log(lobbies);
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
        console.log(`creating lobby ${newLobby.id} with id ${socket.id}`);
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
        console.log("Joining lobby", joinLobby);
        if (joinLobby.id == socket.id) {
            setAwaitingChallenger(true);
        } else {
            socket.emit("join-lobby", joinLobby.id, socket.id);
        }
    }

    return (
        <>
            <div
                className={
                    requirePassword || awaitingChallenger ? "blur-content" : ""
                }
            >
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
        </>
    );
}
