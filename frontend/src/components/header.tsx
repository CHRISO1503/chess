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
                marginTop: 0,
                marginBottom: "10px",
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
                    fontSize: "3.5em",
                    background: "none",
                    border: "none",
                }}
                onClick={() => {
                    navigate("/");
                }}
            >
                Chess Online
            </button>
        </div>
    );
}
