import { useEffect, useState } from "react";
import { cloneGrid, SquareInfo } from "../home";
import ValidMoves from "./validMoves";
import PromotePopup from "./promotePopup";

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
    boardMap: SquareInfo[][];
    setBoardMap: (value: SquareInfo[][]) => void;
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

    // Debug king in check:
    useEffect(() => {
        if (boardMap.length > 0) {
            if (kingIsInCheck(true, boardMap)) {
                console.log("WHITE KING IN CHECK");
            }
            if (kingIsInCheck(false, boardMap)) {
                console.log("BLACK KING IS IN CHECK");
            }
        }
    }, [boardMap]);

    // Handle click of any square
    useEffect(() => {
        console.log(clickedSquare);
        setMoveMap(emptyMoveMap());
        if (boardMap.length > 0) {
            const pieceClicked = boardMap[clickedSquare[0]][clickedSquare[1]];
            if (pieceClicked.isWhite == isWhitesTurn) {
                setMoveMap(calculateValidMoves(clickedSquare, boardMap, false));
            } else {
                if (moveMap[clickedSquare[0]][clickedSquare[1]]) {
                    setBoardMap(
                        movePiece(clickedSquare, boardMap, false) || [[]]
                    );
                    setMoveMap(emptyMoveMap());
                    setIsWhitesTurn(!isWhitesTurn);
                }
            }
        }
    }, [clickedSquare]);

    // Handle turn if promotion
    useEffect(() => {
        if (promotion.promotion != null && promotion.at != null) {
            if (!promotion.promotion) {
                if (isWhitesTurn) {
                    boardMap[promotion.at][0] = {
                        pieceType: promotion.piece,
                        isWhite: isWhitesTurn,
                    };
                    boardMap[clickedSquare[2]][clickedSquare[3]] = {};
                } else {
                    boardMap[promotion.at][7] = {
                        pieceType: promotion.piece,
                        isWhite: isWhitesTurn,
                    };
                    boardMap[clickedSquare[2]][clickedSquare[3]] = {};
                }
                setBoardMap(cloneGrid(boardMap));
                setMoveMap(emptyMoveMap());
                setIsWhitesTurn(!isWhitesTurn);
            } else {
                promotion.promotion = false;
            }
        }
    }, [promotion]);

    function movePiece(
        clickedSquare: number[],
        boardToMove: SquareInfo[][],
        phantomMove: boolean
    ) {
        let board = cloneGrid(boardToMove);
        // Set if rook or king moved
        if (!phantomMove) {
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
                board[clickedSquare[2]][clickedSquare[3]].pieceType == "K"
            ) {
                // Castling
                if (clickedSquare[2] - clickedSquare[0] == 2) {
                    board[3][clickedSquare[1]] = board[0][clickedSquare[1]];
                    board[0][clickedSquare[1]] = {};
                } else if (clickedSquare[2] - clickedSquare[0] == -2) {
                    board[5][clickedSquare[1]] = board[7][clickedSquare[1]];
                    board[7][clickedSquare[1]] = {};
                }
                // King has moved
                if (board[clickedSquare[2]][clickedSquare[3]].isWhite) {
                    setWhiteKingHasMoved(true);
                } else {
                    setBlackKingHasMoved(true);
                }
            }
            // Set passant and promote
            if (board[clickedSquare[2]][clickedSquare[3]].pieceType == "P") {
                if (Math.abs(clickedSquare[1] - clickedSquare[3]) == 2) {
                    setPassant({ passantable: true, at: clickedSquare[0] });
                } else {
                    setPassant({ passantable: false, at: 0 });
                }
                if (clickedSquare[1] == 0 || clickedSquare[1] == 7) {
                    setPromotion({ promotion: true, at: clickedSquare[0] });
                    return [];
                }
            }
        }
        // Passant
        if (
            board[clickedSquare[2]][clickedSquare[3]].pieceType == "P" &&
            Math.abs(clickedSquare[1] - clickedSquare[3]) == 1 &&
            Math.abs(clickedSquare[0] - clickedSquare[2]) == 1
        ) {
            if (passant.passantable && passant.at == clickedSquare[0]) {
                if (
                    (isWhitesTurn && clickedSquare[1] == 2) ||
                    (!isWhitesTurn && clickedSquare[1] == 5)
                ) {
                    board[clickedSquare[0]][clickedSquare[3]] = {};
                    console.log(clickedSquare[0], clickedSquare[3]);
                }
            }
        }
        // Standard piece move/take
        board[clickedSquare[0]][clickedSquare[1]] =
            board[clickedSquare[2]][clickedSquare[3]];
        board[clickedSquare[2]][clickedSquare[3]] = {};
        return cloneGrid(board);
    }

    function calculateValidMoves(
        square: number[],
        boardToCheck: SquareInfo[][],
        immediate: boolean
    ) {
        let moveMap = emptyMoveMap();
        let board = cloneGrid(boardToCheck);
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
                        board[square[0] + i * dir[0]][square[1] + i * dir[1]]
                            .pieceType == null
                    ) {
                        moveMap[square[0] + i * dir[0]][
                            square[1] + i * dir[1]
                        ] = true;
                    } else {
                        if (
                            board[square[0] + i * dir[0]][
                                square[1] + i * dir[1]
                            ].isWhite != board[square[0]][square[1]].isWhite
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

        switch (board[square[0]][square[1]].pieceType) {
            case "P":
                if (board[square[0]][square[1]].isWhite) {
                    if (square[1] - 1 >= 0) {
                        if (!board[square[0]][square[1] - 1].pieceType) {
                            moveMap[square[0]][square[1] - 1] = true;
                            if (square[1] - 2 >= 0) {
                                if (
                                    !board[square[0]][square[1] - 2]
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
                            board[square[0] - 1][square[1] - 1].pieceType &&
                            !board[square[0] - 1][square[1] - 1].isWhite
                        ) {
                            moveMap[square[0] - 1][square[1] - 1] = true;
                        }
                    }
                    if (square[0] + 1 < 8 && square[1] - 1 >= 0) {
                        if (
                            board[square[0] + 1][square[1] - 1].pieceType &&
                            !board[square[0] + 1][square[1] - 1].isWhite
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
                        if (!board[square[0]][square[1] + 1].pieceType) {
                            moveMap[square[0]][square[1] + 1] = true;
                            if (square[1] + 2 < 8) {
                                if (
                                    !board[square[0]][square[1] + 2]
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
                            board[square[0] - 1][square[1] + 1].pieceType &&
                            board[square[0] - 1][square[1] + 1].isWhite
                        ) {
                            moveMap[square[0] - 1][square[1] + 1] = true;
                        }
                    }
                    if (square[0] + 1 < 8 && square[1] + 1 < 8) {
                        if (
                            board[square[0] + 1][square[1] + 1].pieceType &&
                            board[square[0] + 1][square[1] + 1].isWhite
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
                            board[square[0] + move[0]][square[1] + move[1]]
                                .pieceType == null ||
                            board[square[0] + move[0]][square[1] + move[1]]
                                .isWhite != board[square[0]][square[1]].isWhite
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
                            board[square[0] + dir[0]][square[1] + dir[1]]
                                .pieceType == null
                        ) {
                            moveMap[square[0] + dir[0]][square[1] + dir[1]] =
                                true;
                        } else if (
                            board[square[0] + dir[0]][square[1] + dir[1]]
                                .isWhite != board[square[0]][square[1]].isWhite
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
                            !board[1][7].pieceType &&
                            !board[2][7].pieceType &&
                            !board[3][7].pieceType
                        ) {
                            moveMap[2][7] = true;
                        }
                        if (
                            !whiteRooksMoved[1] &&
                            !board[5][7].pieceType &&
                            !board[6][7].pieceType
                        ) {
                            moveMap[6][7] = true;
                        }
                    }
                } else {
                    if (!blackKingHasMoved) {
                        if (
                            !blackRooksMoved[0] &&
                            !board[1][0].pieceType &&
                            !board[2][0].pieceType &&
                            !board[3][0].pieceType
                        ) {
                            moveMap[2][0] = true;
                        }
                        if (
                            !blackRooksMoved[1] &&
                            !board[5][0].pieceType &&
                            !board[6][0].pieceType
                        ) {
                            moveMap[6][0] = true;
                        }
                    }
                }
                break;
            default:
                break;
        }
        if (!immediate) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (moveMap[i][j] == true) {
                        if (
                            kingIsInCheck(
                                isWhitesTurn,
                                movePiece(
                                    [i, j, square[0], square[1]],
                                    board,
                                    true
                                ) || [[]]
                            )
                        ) {
                            console.log("HERE", [i, j]);
                            moveMap[i][j] = false;
                        }
                    }
                }
            }
        }
        // Cannot castle through check
        if (board[square[0]][square[1]].pieceType == "K") {
            if (moveMap[2][7] && !moveMap[3][7]) {
                moveMap[2][7] = false;
            }
            if (moveMap[6][7] && !moveMap[5][7]) {
                moveMap[6][7] = false;
            }
            if (moveMap[2][0] && !moveMap[3][0]) {
                moveMap[2][0] = false;
            }
            if (moveMap[6][0] && !moveMap[5][0]) {
                moveMap[6][0] = false;
            }
        }
        return cloneGrid(moveMap);
    }

    function kingIsInCheck(kingIsWhite: boolean, boardToCheck: SquareInfo[][]) {
        let board = cloneGrid(boardToCheck);
        // Get king's position
        let kingPos = [] as number[];
        iLoop: for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (
                    board[i][j].pieceType == "K" &&
                    board[i][j].isWhite == kingIsWhite
                ) {
                    kingPos = [i, j];
                    break iLoop;
                }
            }
        }
        console.log(board);
        // Check oppositions pieces if they threaten the king
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j].isWhite == !kingIsWhite) {
                    const moveSet = calculateValidMoves([i, j], board, true);
                    if (moveSet[kingPos[0]][kingPos[1]]) {
                        return true;
                    }
                }
            }
        }
        return false;
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
