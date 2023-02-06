import { useNavigate } from "react-router-dom";
import whiteKing from "../../assets/pieces/w_king_svg_NoShadow.svg";

export default function OverTheBoardButton() {
    const navigate = useNavigate();
    return (
        <div
            className="home-menu-button offline-button"
            onClick={() => navigate("/overtheboard")}
        >
            <div>
                <img src={whiteKing} className="white-king" />
            </div>
            Over the board
        </div>
    );
}
