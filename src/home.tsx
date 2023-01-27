import { useEffect, useState } from "react";
import Board from "./components/board";
import GameLogic from "./components/gameLogic";
import Pieces from "./components/pieces";
import ValidMoves from "./components/validMoves";

export const pieceWidth = 70;
export const tileWidth = 100;

export interface SquareInfo {
    pieceType?: string;
    isWhite?: boolean;
}

export function cloneGrid(grid: any[][]) {
    const newGrid = [...grid];
    newGrid.forEach((row, i) => (newGrid[i] = [...row]));
    return newGrid;
}

export default function Home() {
    const [boardMap, setBoardMap] = useState([] as SquareInfo[][]);
    const backRank = ["R", "N", "B", "Q", "K", "B", "N", "R"];
    const [moveMap, setMoveMap] = useState([] as boolean[][]);

    useEffect(() => {
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
        setMoveMap(moveMap.slice());
        // Set transpose
        setBoardMap(
            boardMap[0].map((_, colIndex) =>
                boardMap.map((row) => row[colIndex])
            )
        );
    }, []);

    return (
        <>
            <h1
                style={{
                    textAlign: "center",
                    fontSize: "4em",
                    marginBottom: "10px",
                    marginTop: "10px",
                }}
            >
                Chess
            </h1>
            <div style={{ display: "flex", justifyContent: "center" }}>
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
                    />
                </div>
            </div>
        </>
    );
}
