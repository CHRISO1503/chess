import { useEffect, useState } from "react";
import { Lobby } from "./onlineMenu/lobbyMenu";
import { Socket } from "socket.io-client";
import Game, {
    cloneGrid,
    initialiseBoardMapAndMoveMap,
    SquareInfo,
} from "./game/game";

export default function OnlineGame({
    lobby,
    socket,
}: {
    lobby: Lobby;
    socket: Socket;
}) {
    const [playerIsWhite, setPlayerIsWhite] = useState(false);
    const [boardMap, setBoardMap] = useState([] as SquareInfo[][]);
    const [moveMap, setMoveMap] = useState([] as boolean[][]);
    const [isWhitesTurn, setIsWhitesTurn] = useState(true);
    const [clickedSquare, setClickedSquare] = useState([] as number[]);
    const [kingsMoved, setKingsMoved] = useState([false, false]);
    const [rooksMoved, setRooksMoved] = useState([
        [false, false],
        [false, false],
    ]);
    const [passant, setPassant] = useState({ passantable: false, at: 0 });
    const [isEmittingVariable, setIsEmittingVariable] = useState(false);

    useEffect(() => {
        if (lobby.hostIsWhite != null) {
            if (lobby.id == socket.id) {
                setPlayerIsWhite(lobby.hostIsWhite);
            } else {
                setPlayerIsWhite(!lobby.hostIsWhite);
            }
        }
        setBoardMap(cloneGrid(initialiseBoardMapAndMoveMap().boardMap));
        setMoveMap(cloneGrid(initialiseBoardMapAndMoveMap().moveMap));
        socket.on("begin-turn", (newLobby, turn, clickedSquare) => {
            setBoardMap(cloneGrid(newLobby.boardMap));
            setIsWhitesTurn(turn);
            setClickedSquare(clickedSquare);
        });
        socket.on("update-kings-moved", (kingsMoved) =>
            setKingsMoved(kingsMoved)
        );
        socket.on("update-rooks-moved", (rooksMoved) =>
            setRooksMoved(rooksMoved)
        );
        socket.on("update-passant", (passant) => {
            setPassant(passant);
            console.log("PASSANTABLE");
        });
    }, []);

    // If the players turn has just ended, send map to server. If the players turn has begun, this is handled by socket.on("turn-began")
    useEffect(() => {
        if (boardMap.length > 0) {
            if (playerIsWhite != isWhitesTurn) {
                socket.emit("turn-ended", lobby, boardMap, clickedSquare);
            }
        }
    }, [isWhitesTurn]);

    // Pass state to opponent on change
    useEffect(() => {
        if (isEmittingVariable) {
            socket.emit("kings-moved", lobby, kingsMoved);
            setIsEmittingVariable(false);
        }
    }, [kingsMoved]);

    useEffect(() => {
        if (isEmittingVariable) {
            socket.emit("rooks-moved", lobby, rooksMoved);
            setIsEmittingVariable(false);
        }
    }, [rooksMoved]);

    useEffect(() => {
        if (isEmittingVariable) {
            socket.emit("passant", lobby, passant);
            setIsEmittingVariable(false);
        }
    }, [passant]);

    return (
        <Game
            boardFlipped={!playerIsWhite}
            boardMap={boardMap}
            setBoardMap={setBoardMap}
            moveMap={moveMap}
            setMoveMap={setMoveMap}
            playerIsWhite={playerIsWhite}
            isWhitesTurn={isWhitesTurn}
            setIsWhitesTurn={setIsWhitesTurn}
            clickedSquare={clickedSquare}
            setClickedSquare={setClickedSquare}
            kingsMoved={kingsMoved}
            setKingsMoved={setKingsMoved}
            rooksMoved={rooksMoved}
            setRooksMoved={setRooksMoved}
            passant={passant}
            setPassant={setPassant}
            setIsEmittingVariable={setIsEmittingVariable}
        />
    );
}
