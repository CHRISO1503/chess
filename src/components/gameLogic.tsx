import ValidMoves from "./validMoves";
import { useEffect, useState } from "react";
import { squareInfo } from "../home";
import PromotePopup from "./promotePopup";

// Add queening then checks

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
export interface Promotion {
    promotion?: boolean;
    at?: number;
    piece?: string;
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
    const [whiteKingHasMoved, setWhiteKingHasMoved] = useState(false);
    const [blackKingHasMoved, setBlackKingHasMoved] = useState(false);
    const [whiteRooksMoved, setWhiteRooksMoved] = useState([false, false]);
    const [blackRooksMoved, setBlackRooksMoved] = useState([false, false]);
    const [passant, setPassant] = useState({
        passantable: false,
        at: 0,
    });
    const [promotion, setPromotion] = useState({} as Promotion);

    // Handle click of any square
    useEffect(() => {
        console.log(clickedSquare);
        setMoveMap(emptyMoveMap());
        if (boardMap.length > 0) {
            const pieceClicked = boardMap[clickedSquare[0]][clickedSquare[1]];
            if (pieceClicked.isWhite == isWhitesTurn) {
                calculateValidMoves(pieceClicked, clickedSquare);
            } else {
                movePiece();
            }
        }
    }, [clickedSquare]);

    // Handle turn if promotion
    useEffect(() => {
        if (promotion.promotion != null && promotion.at) {
            if (!promotion.promotion) {
                if (isWhitesTurn) {
                    boardMap[promotion.at][0] = {
                        pieceType: promotion.piece,
                        isWhite: isWhitesTurn,
                    };
                    boardMap[promotion.at][1] = {};
                } else {
                    boardMap[promotion.at][7] = {
                        pieceType: promotion.piece,
                        isWhite: isWhitesTurn,
                    };
                    boardMap[promotion.at][6] = {};
                }
                setBoardMap(boardMap.slice());
                setMoveMap(emptyMoveMap());
                setIsWhitesTurn(!isWhitesTurn);
            }
        }
    }, [promotion]);

    function movePiece() {
        if (moveMap[clickedSquare[0]][clickedSquare[1]]) {
            // Set if rook or king moved
            if (clickedSquare[2] == 0 && clickedSquare[3] == 7) {
                whiteRooksMoved[0] = true;
                setWhiteRooksMoved(whiteRooksMoved.slice());
            } else if (clickedSquare[2] == 7 && clickedSquare[3] == 7) {
                whiteRooksMoved[1] = true;
                setWhiteRooksMoved(whiteRooksMoved.slice());
            } else if (clickedSquare[2] == 0 && clickedSquare[3] == 0) {
                blackRooksMoved[0] = true;
                setBlackRooksMoved(blackRooksMoved.slice());
            } else if (clickedSquare[2] == 7 && clickedSquare[3] == 7) {
                blackRooksMoved[1] = true;
                setBlackRooksMoved(blackRooksMoved.slice());
            } else if (
                boardMap[clickedSquare[2]][clickedSquare[3]].pieceType == "K"
            ) {
                // Castling
                if (clickedSquare[2] - clickedSquare[0] == 2) {
                    boardMap[3][clickedSquare[1]] =
                        boardMap[0][clickedSquare[1]];
                    boardMap[0][clickedSquare[1]] = {};
                } else if (clickedSquare[2] - clickedSquare[0] == -2) {
                    boardMap[5][clickedSquare[1]] =
                        boardMap[7][clickedSquare[1]];
                    boardMap[7][clickedSquare[1]] = {};
                }
                // King has moved
                if (boardMap[clickedSquare[2]][clickedSquare[3]].isWhite) {
                    setWhiteKingHasMoved(true);
                } else {
                    setBlackKingHasMoved(true);
                }
            }
            // Set passant and promote
            if (boardMap[clickedSquare[2]][clickedSquare[3]].pieceType == "P") {
                if (Math.abs(clickedSquare[1] - clickedSquare[3]) == 2) {
                    setPassant({ passantable: true, at: clickedSquare[0] });
                } else {
                    setPassant({ passantable: false, at: 0 });
                }
                if (clickedSquare[1] == 0 || clickedSquare[1] == 7) {
                    setPromotion({ promotion: true, at: clickedSquare[0] });
                    return;
                }
            }
            // Passant
            if (
                boardMap[clickedSquare[2]][clickedSquare[3]].pieceType == "P" &&
                Math.abs(clickedSquare[1] - clickedSquare[3]) == 1 &&
                Math.abs(clickedSquare[0] - clickedSquare[2]) == 1
            ) {
                if (passant.passantable && passant.at == clickedSquare[0]) {
                    boardMap[clickedSquare[0]][clickedSquare[3]] = {};
                }
            }
            // Standard piece move/take
            boardMap[clickedSquare[0]][clickedSquare[1]] =
                boardMap[clickedSquare[2]][clickedSquare[3]];
            boardMap[clickedSquare[2]][clickedSquare[3]] = {};
            setBoardMap(boardMap.slice());
            setMoveMap(emptyMoveMap());
            setIsWhitesTurn(!isWhitesTurn);
        }
    }

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
                            if (square[1] - 2 >= 0) {
                                if (
                                    !boardMap[square[0]][square[1] - 2]
                                        .pieceType &&
                                    square[1] == 6
                                ) {
                                    moveMap[square[0]][square[1] - 2] = true;
                                }
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
                    if (square[1] == 3 && passant.passantable) {
                        if (passant.at == square[0] - 1) {
                            moveMap[square[0] - 1][2] = true;
                        } else if (passant.at == square[0] + 1) {
                            moveMap[square[0] + 1][2] = true;
                        }
                    }
                } else {
                    if (square[1] + 1 < 8) {
                        if (!boardMap[square[0]][square[1] + 1].pieceType) {
                            moveMap[square[0]][square[1] + 1] = true;
                            if (square[1] + 2 < 8) {
                                if (
                                    !boardMap[square[0]][square[1] + 2]
                                        .pieceType &&
                                    square[1] == 1
                                ) {
                                    moveMap[square[0]][square[1] + 2] = true;
                                }
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
                    if (square[1] == 4 && passant.passantable) {
                        if (passant.at == square[0] - 1) {
                            moveMap[square[0] - 1][5] = true;
                        } else if (passant.at == square[0] + 1) {
                            moveMap[square[0] + 1][5] = true;
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
                break;
            case "Q":
                setMovesInDirection(royals);
                break;
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
                if (isWhitesTurn) {
                    if (!whiteKingHasMoved) {
                        if (
                            !whiteRooksMoved[0] &&
                            !boardMap[1][7].pieceType &&
                            !boardMap[2][7].pieceType &&
                            !boardMap[3][7].pieceType
                        ) {
                            moveMap[2][7] = true;
                        }
                        if (
                            !whiteRooksMoved[1] &&
                            !boardMap[5][7].pieceType &&
                            !boardMap[6][7].pieceType
                        ) {
                            moveMap[6][7] = true;
                        }
                    }
                } else {
                    if (!blackKingHasMoved) {
                        if (
                            !blackRooksMoved[0] &&
                            !boardMap[1][0].pieceType &&
                            !boardMap[2][0].pieceType &&
                            !boardMap[3][0].pieceType
                        ) {
                            moveMap[2][0] = true;
                        }
                        if (
                            !blackRooksMoved[1] &&
                            !boardMap[5][0].pieceType &&
                            !boardMap[6][0].pieceType
                        ) {
                            moveMap[6][0] = true;
                        }
                    }
                }
                break;
            default:
                break;
        }
        setMoveMap(moveMap.slice());
    }

    return (
        <>
            <ValidMoves
                moveMap={moveMap}
                clickedSquare={clickedSquare}
                setClickedSquare={setClickedSquare}
            />
            {promotion.promotion ? (
                <PromotePopup
                    promotion={promotion}
                    isWhitesTurn={isWhitesTurn}
                    setPromotion={setPromotion}
                />
            ) : (
                <></>
            )}
        </>
    );
}
