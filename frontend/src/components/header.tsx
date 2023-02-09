import blackKing from "../assets/pieces/b_king_svg_NoShadow.svg";
import home from "../assets/home.svg";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    return (
        <div className="header">
            <img
                src={home}
                draggable="false"
                className="home-button"
                onClick={() => navigate("/")}
            />
            <div>
                <p>Chess Online</p>
                <img src={blackKing} draggable="false" />
            </div>
        </div>
    );
}
