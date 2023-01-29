import "../home.css";
import Board from "./game/board";
import {
    cloneGrid,
    initialiseBoardMapAndMoveMap,
    tileWidth,
} from "./game/game";
import Pieces from "./game/pieces";

export default function HomeMenu({
    setGameMode,
}: {
    setGameMode: (value: string) => void;
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div style={{ position: "absolute", filter: "blur(1px)" }}>
                <Board />
            </div>
            <div style={{ position: "absolute", filter: "blur(1px)" }}>
                <Pieces
                    boardMap={cloneGrid(
                        initialiseBoardMapAndMoveMap().boardMap
                    )}
                />
            </div>
            <div
                style={{
                    position: "absolute",
                    top: tileWidth * 4,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <button
                    className="home-menu"
                    onClick={() => setGameMode("offline")}
                >
                    Over the board
                </button>
                <button
                    className="home-menu"
                    onClick={() => setGameMode("online")}
                >
                    Online
                </button>
            </div>
        </div>
    );
}
