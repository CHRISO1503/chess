import whiteKing from "../../assets/pieces/w_king_svg_NoShadow.svg";
import blackKing from "../../assets/pieces/b_king_svg_NoShadow.svg";
import crossedSwords from "../../assets/crossedSwords.png";
import { useNavigate } from "react-router-dom";

export default function OnlineButton() {
    const navigate = useNavigate();

    return (
        <div
            className="home-menu-button online-button"
            onClick={() => navigate("/online")}
        >
            <div>
                <img src={crossedSwords} />
            </div>
            <p>Online Match</p>
        </div>
    );
}
