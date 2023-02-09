import { useState } from "react";
import { Socket } from "socket.io-client";
import { Lobby } from "./lobbyMenu";
import { initialiseBoardMapAndMoveMap } from "../game/game";

export default function LobbyOptions({
    setNewLobby,
    socket,
    setJoinLobby,
}: {
    setNewLobby: (value: Lobby) => void;
    socket: Socket;
    setJoinLobby: (value: Lobby) => void;
}) {
    const [usePassword, setUsePassword] = useState(false);
    const [lobbyName, setLobbyName] = useState("");
    const [lobbyPassword, setLobbyPassword] = useState("");

    function handleSubmit() {
        const lobby = {
            id: socket.id,
            name: lobbyName,
            password: lobbyPassword != "" ? lobbyPassword : undefined,
            boardMap: initialiseBoardMapAndMoveMap().boardMap,
        };
        setNewLobby(lobby);
        setJoinLobby(lobby);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <h1>Create a game</h1>
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <label>Game name:</label>
                <input
                    type="text"
                    onChange={(e) => setLobbyName(e.target.value)}
                />
                <div>
                    <label>Use password?</label>
                    <input
                        style={{ float: "right" }}
                        type="checkbox"
                        onClick={() => setUsePassword(!usePassword)}
                    />
                </div>
                {usePassword ? (
                    <>
                        <label>Game password:</label>
                        <input
                            type="password"
                            onChange={(e) => setLobbyPassword(e.target.value)}
                        />
                    </>
                ) : (
                    <></>
                )}
                <input
                    type="submit"
                    value="Create lobby"
                    style={{ width: "50%", marginTop: "10px" }}
                />
            </form>
        </div>
    );
}
