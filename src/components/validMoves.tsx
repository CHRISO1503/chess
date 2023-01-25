import { tileWidth } from "../home";

export default function ValidMoves({
    moveMap,
    clickedSquare,
    setClickedSquare,
}: {
    moveMap: boolean[][];
    clickedSquare: number[];
    setClickedSquare: (value: number[]) => void;
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
                                clickedSquare.unshift(i, j);
                                setClickedSquare(clickedSquare.slice(0,4));
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
