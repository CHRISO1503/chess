import whitePawn from "../assets/pieces/w_pawn_svg_NoShadow.svg";
import whiteKnight from "../assets/pieces/w_knight_svg_NoShadow.svg";
import whiteBishop from "../assets/pieces/w_bishop_svg_NoShadow.svg";
import whiteRook from "../assets/pieces/w_rook_svg_NoShadow.svg";
import whiteQueen from "../assets/pieces/w_queen_svg_NoShadow.svg";
import whiteKing from "../assets/pieces/w_king_svg_NoShadow.svg";
import blackPawn from "../assets/pieces/b_pawn_svg_NoShadow.svg";
import blackKnight from "../assets/pieces/b_knight_svg_NoShadow.svg";
import blackBishop from "../assets/pieces/b_bishop_svg_NoShadow.svg";
import blackRook from "../assets/pieces/b_rook_svg_NoShadow.svg";
import blackQueen from "../assets/pieces/b_queen_svg_NoShadow.svg";
import blackKing from "../assets/pieces/b_king_svg_NoShadow.svg";
import { pieceWidth, squareInfo, tileWidth } from "../home";

export const sizeMultipliers = [1, 1.1, 1.2, 1.05, 1.3, 1.25];
export const whiteAssets = [
    whitePawn,
    whiteKnight,
    whiteBishop,
    whiteRook,
    whiteQueen,
    whiteKing,
];
export const blackAssets = [
    blackPawn,
    blackKnight,
    blackBishop,
    blackRook,
    blackQueen,
    blackKing,
];

export default function Piece({ squareInfo }: { squareInfo: squareInfo }) {
    const piecesString = "PNBRQK";
    const isWhite = squareInfo.isWhite ? squareInfo.isWhite : false;
    const pieceIndex = squareInfo.pieceType
        ? piecesString.indexOf(squareInfo.pieceType)
        : null;

    return (
        <div
            style={{
                width: tileWidth,
                height: tileWidth,
                display: "flex",
                justifyContent: "center",
            }}
        >
            {pieceIndex != null ? (
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
