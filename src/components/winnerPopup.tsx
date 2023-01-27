import { tileWidth } from "../home";
import { Winner } from "./gameLogic";

export default function WinnerPopup({ playerWins }: { playerWins: Winner }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div style={{ textAlign: "center" }}>{`${
                playerWins.winnerIsWhite ? "White" : "Black"
            } wins by checkmate!`}</div>
            <input
                type={"button"}
                value={"Play again"}
                style={{ width: tileWidth * 2 }}
                onClick={() => window.location.reload()}
            />
        </div>
    );
}
