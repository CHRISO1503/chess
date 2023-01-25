import ValidMoves from "./validMoves";
import { useEffect, useState } from "react";
import { squareInfo } from "../home";

export function emptyMoveMap() {
    let array = [] as boolean[][];
    for (let i = 0; i < 8; i++) {
        array.push([]);
        for (let j = 0; j < 8; j++) {
            array[i].push(false);
        }
    }
    return array;
}

// Clicks are triggered from validMoves.tsx
export default function GameLogic({
    moveMap,
    setMoveMap,
    boardMap,
    setBoardMap,
}: {
    moveMap: boolean[][];
    setMoveMap: (value: boolean[][]) => void;
    boardMap: squareInfo[][];
    setBoardMap: (value: squareInfo[][]) => void;
}) {
    const [clickedSquare, setClickedSquare] = useState([] as number[]);
    const [isWhitesTurn, setIsWhitesTurn] = useState(true);
    const [pieceSelected, setPieceSelected] = useState(false);

    // Handle click of any square
    useEffect(() => {
        setMoveMap(emptyMoveMap());
        if (boardMap.length > 0) {
            const pieceClicked = boardMap[clickedSquare[0]][clickedSquare[1]];
            if (pieceClicked.isWhite == isWhitesTurn) {
                calculateValidMoves(pieceClicked, clickedSquare);
            } else {
                // If square is in moveMap then replace square with piece and change prev piece to empty
                if (moveMap[clickedSquare[0]][clickedSquare[1]]) {
                    boardMap[clickedSquare[0]][clickedSquare[1]] =
                        boardMap[clickedSquare[2]][clickedSquare[3]];
                    boardMap[clickedSquare[2]][clickedSquare[3]] = {};
                    setBoardMap(boardMap.slice());
                    setMoveMap(emptyMoveMap());
                    setIsWhitesTurn(!isWhitesTurn);
                }
            }
        }
    }, [clickedSquare]);

    function calculateValidMoves(piece: squareInfo, square: number[]) {
        let moveMap = emptyMoveMap();
        const diagonals = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
        ];
        const straights = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ];
        const royals = diagonals.concat(straights);

        const setMovesInDirection = (dirs: number[][]) => {
            for (const dir of dirs) {
                let i = 1;
                while (
                    square[0] + i * dir[0] < 8 &&
                    square[1] + i * dir[1] < 8 &&
                    square[0] + i * dir[0] >= 0 &&
                    square[1] + i * dir[1] >= 0
                ) {
                    if (
                        boardMap[square[0] + i * dir[0]][square[1] + i * dir[1]]
                            .pieceType == null
                    ) {
                        moveMap[square[0] + i * dir[0]][
                            square[1] + i * dir[1]
                        ] = true;
                    } else {
                        if (
                            boardMap[square[0] + i * dir[0]][
                                square[1] + i * dir[1]
                            ].isWhite != isWhitesTurn
                        ) {
                            moveMap[square[0] + i * dir[0]][
                                square[1] + i * dir[1]
                            ] = true;
                            break;
                        } else {
                            break;
                        }
                    }
                    i += 1;
                }
            }
        };

        switch (piece.pieceType) {
            case "P":
                if (piece.isWhite) {
                    if (square[1] - 1 >= 0) {
                        if (!boardMap[square[0]][square[1] - 1].pieceType) {
                            moveMap[square[0]][square[1] - 1] = true;
                            if (
                                !boardMap[square[0]][square[1] - 2].pieceType &&
                                square[1] == 6
                            ) {
                                moveMap[square[0]][square[1] - 2] = true;
                            }
                        }
                    }
                    if (square[0] - 1 >= 0 && square[1] - 1 >= 0) {
                        if (
                            boardMap[square[0] - 1][square[1] - 1].pieceType &&
                            !boardMap[square[0] - 1][square[1] - 1].isWhite
                        ) {
                            moveMap[square[0] - 1][square[1] - 1] = true;
                        }
                    }
                    if (square[0] + 1 < 8 && square[1] - 1 >= 0) {
                        if (
                            boardMap[square[0] + 1][square[1] - 1].pieceType &&
                            !boardMap[square[0] + 1][square[1] - 1].isWhite
                        ) {
                            moveMap[square[0] + 1][square[1] - 1] = true;
                        }
                    }
                } else {
                    if (square[1] + 1 < 8) {
                        if (!boardMap[square[0]][square[1] + 1].pieceType) {
                            moveMap[square[0]][square[1] + 1] = true;
                            if (
                                !boardMap[square[0]][square[1] + 2].pieceType &&
                                square[1] == 1
                            ) {
                                moveMap[square[0]][square[1] + 2] = true;
                            }
                        }
                    }
                    if (square[0] - 1 >= 0 && square[1] + 1 < 8) {
                        if (
                            boardMap[square[0] - 1][square[1] + 1].pieceType &&
                            boardMap[square[0] - 1][square[1] + 1].isWhite
                        ) {
                            moveMap[square[0] - 1][square[1] + 1] = true;
                        }
                    }
                    if (square[0] + 1 < 8 && square[1] + 1 < 8) {
                        if (
                            boardMap[square[0] + 1][square[1] + 1].pieceType &&
                            boardMap[square[0] + 1][square[1] + 1].isWhite
                        ) {
                            moveMap[square[0] + 1][square[1] + 1] = true;
                        }
                    }
                }
                break;
            case "N":
                for (const move of [
                    [1, 2],
                    [2, 1],
                    [-1, 2],
                    [2, -1],
                    [-1, -2],
                    [-2, -1],
                    [1, -2],
                    [-2, 1],
                ]) {
                    if (
                        square[0] + move[0] < 8 &&
                        square[0] + move[0] >= 0 &&
                        square[1] + move[1] < 8 &&
                        square[1] + move[1] >= 0
                    ) {
                        if (
                            boardMap[square[0] + move[0]][square[1] + move[1]]
                                .pieceType == null ||
                            boardMap[square[0] + move[0]][square[1] + move[1]]
                                .isWhite != isWhitesTurn
                        ) {
                            moveMap[square[0] + move[0]][square[1] + move[1]] =
                                true;
                        }
                    }
                }
                break;
            case "B":
                setMovesInDirection(diagonals);
                break;
            case "R":
                setMovesInDirection(straights);
            case "Q":
                setMovesInDirection(royals);
            case "K":
                for (const dir of royals) {
                    if (
                        square[0] + dir[0] < 8 &&
                        square[1] + dir[1] < 8 &&
                        square[0] + dir[0] >= 0 &&
                        square[1] + dir[1] >= 0
                    ) {
                        if (
                            boardMap[square[0] + dir[0]][square[1] + dir[1]]
                                .pieceType == null
                        ) {
                            moveMap[square[0] + dir[0]][square[1] + dir[1]] =
                                true;
                        } else if (
                            boardMap[square[0] + dir[0]][square[1] + dir[1]]
                                .isWhite != isWhitesTurn
                        ) {
                            moveMap[square[0] + dir[0]][square[1] + dir[1]] =
                                true;
                        }
                    }
                }
            default:
                break;
        }
        setMoveMap(moveMap.slice());
    }

    return (
        <ValidMoves
            moveMap={moveMap}
            clickedSquare={clickedSquare}
            setClickedSquare={setClickedSquare}
        />
    );
}
