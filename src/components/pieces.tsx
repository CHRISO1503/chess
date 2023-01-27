import { SquareInfo } from "../home";
import Piece from "./piece";

export default function Pieces({
    boardMap,
    isACheck,
}: {
    boardMap: SquareInfo[][];
    isACheck: { isACheck: boolean; isWhite: boolean };
}) {
    return (
        <div style={{ display: "flex" }}>
            {boardMap.map((row, i) => (
                <div key={i}>
                    {row.map((cell, j) => (
                        <Piece key={j} squareInfo={cell} isACheck={isACheck} />
                    ))}
                </div>
            ))}
        </div>
    );
}
