import { useNavigate } from "react-router-dom";
import { tileWidth } from "./game/game";

export default function Header() {
    const navigate = useNavigate();
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <button
                className="navigate"
                style={{
                    textAlign: "center",
                    fontSize: "4em",
                    marginBottom: "10px",
                    marginTop: "10px",
                    minWidth: tileWidth * 3,
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
