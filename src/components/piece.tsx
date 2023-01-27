import whitePawn from "../assets/pieces/w_pawn_svg_NoShadow.svg";
import whiteKnight from "../assets/pieces/w_knight_svg_NoShadow.svg";
import whiteBishop from "../assets/pieces/w_bishop_svg_NoShadow.svg";
import whiteRook from "../assets/pieces/w_rook_svg_NoShadow.svg";
import whiteQueen from "../assets/pieces/w_queen_svg_NoShadow.svg";
import whiteKing from "../assets/pieces/w_king_svg_NoShadow.svg";
import whiteKingInCheck from "../assets/pieces/w_king_svg_withShadow.svg";
import blackPawn from "../assets/pieces/b_pawn_svg_NoShadow.svg";
import blackKnight from "../assets/pieces/b_knight_svg_NoShadow.svg";
import blackBishop from "../assets/pieces/b_bishop_svg_NoShadow.svg";
import blackRook from "../assets/pieces/b_rook_svg_NoShadow.svg";
import blackQueen from "../assets/pieces/b_queen_svg_NoShadow.svg";
import blackKing from "../assets/pieces/b_king_svg_NoShadow.svg";
import blackKingInCheck from "../assets/pieces/b_king_svg_withShadow.svg";
import { pieceWidth, SquareInfo, tileWidth } from "../home";
import { useEffect, useState } from "react";

export const sizeMultipliers = [1, 1.1, 1.2, 1.05, 1.3, 1.25, 2.5];
export const whiteAssets = [
    whitePawn,
    whiteKnight,
    whiteBishop,
    whiteRook,
    whiteQueen,
    whiteKing,
    whiteKingInCheck,
];
export const blackAssets = [
    blackPawn,
    blackKnight,
    blackBishop,
    blackRook,
    blackQueen,
    blackKing,
    blackKingInCheck,
];

export default function Piece({
    squareInfo,
    isACheck,
}: {
    squareInfo: SquareInfo;
    isACheck: { isACheck: boolean; isWhite: boolean };
}) {
    const piecesString = "PNBRQK";
    const isWhite = squareInfo.isWhite ? squareInfo.isWhite : false;
    const [pieceIndex, setPieceIndex] = useState(0);

    useEffect(() => {
        setPieceIndex(
            squareInfo.pieceType
                ? piecesString.indexOf(squareInfo.pieceType)
                : -1
        );
        if (isACheck.isACheck && pieceIndex == 5) {
            if (isACheck.isWhite == isWhite) {
                setPieceIndex(6);
            }
        }
    }, [isACheck]);

    return (
        <div
            style={{
                width: tileWidth,
                height: tileWidth,
                display: "flex",
                justifyContent: "center",
            }}
        >
            {pieceIndex != -1 ? (
                <img
                    src={
                        isWhite
                            ? whiteAssets[pieceIndex]
                            : blackAssets[pieceIndex]
                    }
                    style={{
                        width: `${pieceWidth * sizeMultipliers[pieceIndex]}px`,
                        userSelect: "none",
                    }}
                    draggable="false"
                />
            ) : (
                <div></div>
            )}
        </div>
    );
}
