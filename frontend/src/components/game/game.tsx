import useWindowDimensions from "../../getWindowDimensions";
import Board from "./board";
import GameLogic from "./gameLogic";
import Pieces from "./pieces";

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

// https://stackoverflow.com/questions/19333002/rotate-a-matrix-array-by-180-degrees
export function flipBoard(grid: any[][]) {
    grid = cloneGrid(grid);
    grid.reverse().forEach(function (item) {
        item.reverse();
    });
    return cloneGrid(grid);
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

export default function Game({
    boardFlipped,
    boardMap,
    setBoardMap,
    moveMap,
    setMoveMap,
    playerIsWhite,
    isWhitesTurn,
    setIsWhitesTurn,
    clickedSquare,
    setClickedSquare,
    kingsMoved,
    setKingsMoved,
    rooksMoved,
    setRooksMoved,
    passant,
    setPassant,
}: {
    boardFlipped: boolean;
    boardMap: SquareInfo[][];
    setBoardMap: (value: SquareInfo[][]) => void;
    moveMap: boolean[][];
    setMoveMap: (value: boolean[][]) => void;
    playerIsWhite?: boolean;
    isWhitesTurn: boolean;
    setIsWhitesTurn: (value: boolean) => void;
    clickedSquare: number[];
    setClickedSquare: (value: number[]) => void;
    kingsMoved: boolean[];
    setKingsMoved: (value: boolean[]) => void;
    rooksMoved: boolean[][];
    setRooksMoved: (value: boolean[][]) => void;
    passant: { passantable: boolean; at: number };
    setPassant: (value: { passantable: boolean; at: number }) => void;
}) {
    const { height, width } = useWindowDimensions();

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    transform:
                        width > tileWidth * 8
                            ? "scale(1)"
                            : `scale(${width / (tileWidth * 8) - 0.05})`,
                }}
            >
                <div>
                    <Board />
                </div>
                <div style={{ marginLeft: -tileWidth * 8 }}>
                    <Pieces
                        boardMap={boardFlipped ? flipBoard(boardMap) : boardMap}
                    />
                </div>
                <div style={{ marginLeft: -tileWidth * 8 }}>
                    <GameLogic
                        moveMap={moveMap}
                        setMoveMap={setMoveMap}
                        boardMap={boardMap}
                        setBoardMap={setBoardMap}
                        boardFlipped={boardFlipped}
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
                    />
                </div>
            </div>
        </>
    );
}
