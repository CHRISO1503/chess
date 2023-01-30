import "../home.css";
import Board from "./game/board";
import {
    cloneGrid,
    initialiseBoardMapAndMoveMap,
    tileWidth,
} from "./game/game";
import Pieces from "./game/pieces";
import { useNavigate } from "react-router-dom";

export default function HomeMenu() {
    const navigate = useNavigate();
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
                    onClick={() => navigate("/overtheboard")}
                >
                    Over the board
                </button>
                <button
                    className="home-menu"
                    onClick={() => navigate("/online")}
                >
                    Online
                </button>
            </div>
        </div>
    );
}
