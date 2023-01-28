import { SquareInfo } from "../home";
import Piece from "./piece";

export default function Pieces({ boardMap }: { boardMap: SquareInfo[][] }) {
    return (
        <div style={{ display: "flex" }}>
            {boardMap.map((row, i) => (
                <div key={i}>
                    {row.map((cell, j) => (
                        <Piece key={j} squareInfo={cell} />
                    ))}
                </div>
            ))}
        </div>
    );
}
