import { Socket } from "socket.io-client";
import { Lobby } from "../routes/online";

export default function LobbyList({
    lobbyList,
    socket,
    setJoinLobby,
}: {
    lobbyList: Lobby[];
    socket: Socket;
    setJoinLobby: (value: Lobby) => void;
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <h1>Join a game</h1>
            {lobbyList.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Password?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lobbyList.map((lobby, i) => (
                            <tr key={i} onClick={() => setJoinLobby(lobby)}>
                                <td>{lobby.id}</td>
                                <td>{lobby.name}</td>
                                <td>{lobby.password ? "Y" : "N"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No current lobbies</p>
            )}
            <button onClick={() => socket.emit("refresh-lobbies")}>
                Refresh list
            </button>
        </div>
    );
}
