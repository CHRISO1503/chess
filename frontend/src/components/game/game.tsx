import { useEffect, useState } from "react";
import Board from "./board";
import GameLogic from "./gameLogic";
import Pieces from "./pieces";
import socketIOClient from "socket.io-client";
import { deployed } from "../../appSettings";

const ENDPOINT = deployed ? "" : "http://localhost:5000";
export const pieceWidth = 70;
export const tileWidth = 100;
export const backRank = ["R", "N", "B", "Q", "K", "B", "N", "R"];

export interface SquareInfo {
    pieceType?: string;
    isWhite?: boolean;
}

export function cloneGrid(grid: any[][]) {
    const newGrid = [...grid];
    newGrid.forEach((row, i) => (newGrid[i] = [...row]));
    return newGrid;
}

export function initialiseBoardMapAndMoveMap() {
    // Initialise boardMap and moveMap
    let boardMap = [] as SquareInfo[][];
    let moveMap = [] as boolean[][];
    for (let i = 0; i < 8; i++) {
        boardMap.push([]);
        moveMap.push([]);
        for (let j = 0; j < 8; j++) {
            moveMap[i].push(false);
            switch (i) {
                case 0:
                    boardMap[i].push({
                        pieceType: backRank[j],
                        isWhite: false,
                    });
                    break;
                case 7:
                    boardMap[i].push({
                        pieceType: backRank[j],
                        isWhite: true,
                    });
                    break;
                case 1:
                    boardMap[i].push({ pieceType: "P", isWhite: false });
                    break;
                case 6:
                    boardMap[i].push({ pieceType: "P", isWhite: true });
                    break;
                default:
                    boardMap[i].push({});
                    break;
            }
        }
    }
    boardMap = boardMap[0].map((_, colIndex) =>
        boardMap.map((row) => row[colIndex])
    );
    return { moveMap: moveMap, boardMap: boardMap };
}

export default function Game({ gameMode }: { gameMode: string }) {
    const [boardMap, setBoardMap] = useState([] as SquareInfo[][]);
    const [moveMap, setMoveMap] = useState([] as boolean[][]);
    const [isACheck, setIsACheck] = useState({
        isACheck: false,
        isWhite: false,
    });
    const [response, setResponse] = useState("");
    const [playerNumber, setPlayerNumber] = useState(-1);
    const [gameNumber, setGameNumber] = useState(-1);

    useEffect(() => {
        if (playerNumber == -1) {
            const socket = socketIOClient(ENDPOINT);
            socket.on("connect", () => console.log("Connected to server"));
            socket.on("player-number", (playerNumber) => {
                setPlayerNumber(playerNumber);
                console.log(playerNumber);
            });
        }
    }, []);

    useEffect(() => {
        setMoveMap(cloneGrid(initialiseBoardMapAndMoveMap().moveMap));
        setBoardMap(cloneGrid(initialiseBoardMapAndMoveMap().boardMap));
    }, []);

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    minWidth: tileWidth * 8,
                }}
            >
                <div style={{ position: "absolute" }}>
                    <Board />
                </div>
                <div style={{ position: "absolute" }}>
                    <Pieces boardMap={boardMap} />
                </div>
                <div style={{ position: "absolute" }}>
                    <GameLogic
                        moveMap={moveMap}
                        setMoveMap={setMoveMap}
                        boardMap={boardMap}
                        setBoardMap={setBoardMap}
                        isACheck={isACheck}
                        setIsACheck={setIsACheck}
                    />
                </div>
            </div>
        </>
    );
}
