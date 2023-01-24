import { useEffect, useState } from "react";
import Board from "./components/board";
import Pieces from "./components/pieces";

export const pieceWidth = 70;
export const tileWidth = 100;

export interface squareInfo {
    pieceType?: string;
    isWhite?: boolean;
}

export default function Home() {
    const [boardMap, setBoardMap] = useState([] as squareInfo[][]);
    const backRank = ["R", "N", "B", "Q", "K", "B", "N", "R"];

    useEffect(() => {
        // Initialise boardMap
        let boardMap = [] as squareInfo[][];
        for (let i = 0; i < 8; i++) {
            boardMap.push([]);
            for (let j = 0; j < 8; j++) {
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
            </div>
        </>
    );
}
