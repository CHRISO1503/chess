import { useNavigate } from "react-router-dom";
import { tileWidth } from "./game/game";
import blackKing from "../assets/pieces/b_king_svg_NoShadow.svg";
import useWindowDimensions from "../getWindowDimensions";

export default function Header() {
    const { width, height } = useWindowDimensions();
    const navigate = useNavigate();
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <img
                src={blackKing}
                style={{
                    width: tileWidth * 0.65,
                    userSelect: "none",
                }}
                draggable="false"
            />
            <button
                className="navigate"
                style={{
                    textAlign: "center",
                    fontSize: "4em",
                    marginBottom: "10px",
                    marginTop: "10px",
                    minWidth: tileWidth * 2,
                    background: "none",
                    border: "none",
                }}
                onClick={() => {
                    navigate("/");
                }}
            >
                Chess
            </button>
        </div>
    );
}
