import { tileWidth } from "./game";

export default function ValidMoves({
    moveMap,
    clickedSquare,
    setClickedSquare,
    boardFlipped,
    moveAuthorized,
}: {
    moveMap: boolean[][];
    clickedSquare: number[];
    setClickedSquare: (value: number[]) => void;
    boardFlipped: boolean;
    moveAuthorized: boolean;
}) {
    return (
        <div style={{ display: "flex" }}>
            {moveMap.map((row, i) => (
                <div key={i}>
                    {row.map((cell, j) => (
                        <div
                            key={j}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                width: tileWidth,
                                height: tileWidth,
                            }}
                            onClick={() => {
                                if (moveAuthorized) {
                                    boardFlipped
                                        ? clickedSquare.unshift(7 - i, 7 - j)
                                        : clickedSquare.unshift(i, j);
                                    setClickedSquare(clickedSquare.slice(0, 4));
                                }
                            }}
                        >
                            {cell ? (
                                <div
                                    style={{
                                        width: tileWidth,
                                        height: tileWidth,
                                        backgroundColor: "black",
                                        clipPath: `circle(${
                                            tileWidth / 5.5
                                        }px)`,
                                        opacity: "0.55",
                                    }}
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
