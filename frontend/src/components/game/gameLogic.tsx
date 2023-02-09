import { useEffect, useState } from "react";
import { cloneGrid, flipBoard, SquareInfo } from "./game";
import ValidMoves from "./validMoves";
import PromotePopup from "./promotePopup";
import WinnerPopup from "./winnerPopup";
import { Socket } from "socket.io-client";

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
export interface Winner {
    winner: boolean;
    winnerIsWhite?: boolean;
}

// Clicks are triggered from validMoves.tsx
export default function GameLogic({
    moveMap,
    setMoveMap,
    boardMap,
    setBoardMap,
    boardFlipped,
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
    setIsEmittingVariable,
}: {
    moveMap: boolean[][];
    setMoveMap: (value: boolean[][]) => void;
    boardMap: SquareInfo[][];
    setBoardMap: (value: SquareInfo[][]) => void;
    boardFlipped: boolean;
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
    setIsEmittingVariable?: (value: boolean) => void;
}) {
    const [promotion, setPromotion] = useState({} as Promotion);
    const [playerWins, setPlayerWins] = useState({
        winner: false,
    } as Winner);
    const [isACheck, setIsACheck] = useState({
        isACheck: false,
        isWhite: false,
    });
    const [moveAuthorized, setMoveAuthorized] = useState(true);

    // Every render check if user can make inputs by whose turn it is:
    useEffect(() => {
        if (playerIsWhite != undefined) {
            if (moveAuthorized == false) {
                if (playerIsWhite == isWhitesTurn) {
                    setMoveAuthorized(true);
                }
            } else {
                if (playerIsWhite != isWhitesTurn) {
                    setMoveAuthorized(false);
                }
            }
        }
    });

    // Set checks and checkmate:
    useEffect(() => {
        if (boardMap.length > 0) {
            if (kingIsInCheckMate(isWhitesTurn, boardMap)) {
                setPlayerWins({ winner: true, winnerIsWhite: !isWhitesTurn });
            }
            // For sound playing on check
            if (kingIsInCheck(true, boardMap)) {
                setIsACheck({ isACheck: true, isWhite: true });
            } else if (kingIsInCheck(false, boardMap)) {
                setIsACheck({ isACheck: true, isWhite: false });
            } else {
                setIsACheck({ isACheck: false, isWhite: false });
            }
        }
    }, [boardMap]);

    // Handle click of any square
    useEffect(() => {
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
        if (boardMap.length > 0) {
            if (promotion.promotion != null && promotion.at != null) {
                let board = cloneGrid(boardMap);
                if (!promotion.promotion) {
                    // Promote piece
                    if (isWhitesTurn) {
                        board[promotion.at][0] = {
                            pieceType: promotion.piece,
                            isWhite: isWhitesTurn,
                        };
                        board[clickedSquare[2]][clickedSquare[3]] = {};
                    } else {
                        board[promotion.at][7] = {
                            pieceType: promotion.piece,
                            isWhite: isWhitesTurn,
                        };
                        board[clickedSquare[2]][clickedSquare[3]] = {};
                    }
                    setBoardMap(cloneGrid(board));
                    setPromotion({});
                    setIsWhitesTurn(!isWhitesTurn);
                } else {
                    setIsWhitesTurn(!isWhitesTurn);
                }
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
                rooksMoved[0][0] = true;
                if (setIsEmittingVariable) {
                    setIsEmittingVariable(true);
                }
                setRooksMoved(cloneGrid(rooksMoved));
            } else if (clickedSquare[2] == 7 && clickedSquare[3] == 7) {
                rooksMoved[0][1] = true;
                if (setIsEmittingVariable) {
                    setIsEmittingVariable(true);
                }
                setRooksMoved(cloneGrid(rooksMoved));
            } else if (clickedSquare[2] == 0 && clickedSquare[3] == 0) {
                rooksMoved[1][0] = true;
                if (setIsEmittingVariable) {
                    setIsEmittingVariable(true);
                }
                setRooksMoved(cloneGrid(rooksMoved));
            } else if (clickedSquare[2] == 7 && clickedSquare[3] == 7) {
                rooksMoved[1][1] = true;
                if (setIsEmittingVariable) {
                    setIsEmittingVariable(true);
                }
                setRooksMoved(cloneGrid(rooksMoved));
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
                    kingsMoved[0] = true;
                    if (setIsEmittingVariable) {
                        setIsEmittingVariable(true);
                    }
                    setKingsMoved(kingsMoved.slice());
                } else {
                    kingsMoved[1] = true;
                    if (setIsEmittingVariable) {
                        setIsEmittingVariable(true);
                    }
                    setKingsMoved(kingsMoved.slice());
                }
            }
            // Set passant and promote
            if (board[clickedSquare[2]][clickedSquare[3]].pieceType == "P") {
                if (Math.abs(clickedSquare[1] - clickedSquare[3]) == 2) {
                    if (setIsEmittingVariable) {
                        setIsEmittingVariable(true);
                    }
                    setPassant({ passantable: true, at: clickedSquare[0] });
                } else {
                    if (setIsEmittingVariable) {
                        setIsEmittingVariable(true);
                    }
                    setPassant({ passantable: false, at: 0 });
                }
                if (clickedSquare[1] == 0 || clickedSquare[1] == 7) {
                    setPromotion({ promotion: true, at: clickedSquare[0] });
                    return board;
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
                    if (!kingsMoved[0]) {
                        if (
                            !rooksMoved[0][0] &&
                            !board[1][7].pieceType &&
                            !board[2][7].pieceType &&
                            !board[3][7].pieceType
                        ) {
                            moveMap[2][7] = true;
                        }
                        if (
                            !rooksMoved[0][1] &&
                            !board[5][7].pieceType &&
                            !board[6][7].pieceType
                        ) {
                            moveMap[6][7] = true;
                        }
                    }
                } else {
                    if (!kingsMoved[1]) {
                        if (
                            !rooksMoved[1][0] &&
                            !board[1][0].pieceType &&
                            !board[2][0].pieceType &&
                            !board[3][0].pieceType
                        ) {
                            moveMap[2][0] = true;
                        }
                        if (
                            !rooksMoved[1][1] &&
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
                            movePiece([i, j, square[0], square[1]], board, true)
                                .length > 0
                        ) {
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
                                moveMap[i][j] = false;
                            }
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

    function kingIsInCheck(kingIsWhite: boolean, board: SquareInfo[][]) {
        let kingPos = getKingPosition(kingIsWhite, board) || [];
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

    function kingIsInCheckMate(kingIsWhite: boolean, board: SquareInfo[][]) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j].isWhite == kingIsWhite) {
                    let moveMap = calculateValidMoves([i, j], board, false);
                    for (let i2 = 0; i2 < 8; i2++) {
                        for (let j2 = 0; j2 < 8; j2++) {
                            if (moveMap[i2][j2]) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }

    function getKingPosition(kingIsWhite: boolean, board: SquareInfo[][]) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (
                    board[i][j].pieceType == "K" &&
                    board[i][j].isWhite == kingIsWhite
                ) {
                    return [i, j];
                }
            }
        }
    }

    return (
        <>
            <ValidMoves
                moveMap={boardFlipped ? flipBoard(moveMap) : moveMap}
                clickedSquare={clickedSquare}
                setClickedSquare={setClickedSquare}
                boardFlipped={boardFlipped}
                moveAuthorized={moveAuthorized}
            />
            <PromotePopup
                promotion={promotion}
                isWhitesTurn={isWhitesTurn}
                setPromotion={setPromotion}
            />
            {playerWins.winner ? (
                <WinnerPopup playerWins={playerWins} />
            ) : (
                <></>
            )}
        </>
    );
}
