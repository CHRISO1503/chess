import { Socket } from "socket.io-client";
import { Lobby } from "./lobbyMenu";

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
                            <th>Lobby Name</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {lobbyList.map((lobby, i) =>
                            !lobby.opponentId ? (
                                <tr
                                    key={i}
                                    onClick={() => setJoinLobby(lobby)}
                                    className="lobby-row"
                                >
                                    <td
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {lobby.name}
                                    </td>
                                    <td
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            width: "10px",
                                        }}
                                    >
                                        {lobby.password ? "🔒" : ""}
                                    </td>
                                    <td>
                                        <input type="button" value="Join" />
                                    </td>
                                </tr>
                            ) : (
                                <tr key={i}></tr>
                            )
                        )}
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
