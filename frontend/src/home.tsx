import { useState } from "react";
import Game, { tileWidth } from "./components/game/game";
import HomeMenu from "./components/homeMenu";

export default function Home() {
    const [gameMode, setGameMode] = useState("");

    function gameModule(gameMode: string) {
        if (gameMode == "offline") {
            return <Game gameMode={"offline"} />;
        } else if (gameMode == "online") {
            return <Game gameMode={"online"} />;
        } else {
            return <HomeMenu setGameMode={setGameMode} />;
        }
    }
    return (
        <>
            <h1
                style={{
                    textAlign: "center",
                    fontSize: "4em",
                    marginBottom: "10px",
                    marginTop: "10px",
                    minWidth: tileWidth * 8,
                }}
            >
                Chess
            </h1>
            {gameModule(gameMode)}
        </>
    );
}
