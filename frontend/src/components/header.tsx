import { useNavigate } from "react-router-dom";
import { tileWidth } from "./game/game";
import blackKing from "../assets/pieces/b_king_svg_NoShadow.svg";
import useWindowDimensions from "../getWindowDimensions";

export default function Header() {
    const { width, height } = useWindowDimensions();
    const navigate = useNavigate();
    return (
        <div
            className="header"
            onClick={() => {
                navigate("/");
            }}
        >
            <img
                src={blackKing}
                draggable="false"
            />
            <button
                onClick={() => {
                    navigate("/");
                }}
            >
                Chess Online
            </button>
        </div>
    );
}
