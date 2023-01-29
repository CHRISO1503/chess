import { useEffect, useState } from "react";
import { tileWidth } from "./game";

export default function Board() {
    const [tileMap, setTileMap] = useState([] as number[][]);
    const [boardTheme, setBoardTheme] = useState([] as number[][]);
    const defaultTheme = [
        [232, 241, 255],
        [79, 148, 255],
    ];

    useEffect(() => {
        setBoardTheme(defaultTheme);
        let tileColours = [] as number[][];
        for (let i = 0; i < 8; i++) {
            tileColours.push([]);
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 == 0) {
                    tileColours[i].push(0);
                } else {
                    tileColours[i].push(1);
                }
            }
        }
        setTileMap(tileColours.slice());
    }, []);

    return (
        <div style={{ display: "flex" }}>
            {tileMap.map((row, i) => (
                <div key={i}>
                    {row.map((cell, j) => (
                        <div
                            key={j}
                            style={{
                                backgroundColor:
                                    cell == 0
                                        ? `rgb(${boardTheme[0][0]},${boardTheme[0][1]},${boardTheme[0][2]})`
                                        : `rgb(${boardTheme[1][0]},${boardTheme[1][1]},${boardTheme[1][2]})`,
                                width: tileWidth,
                                height: tileWidth,
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
