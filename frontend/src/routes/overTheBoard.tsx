import Game from "../components/game/game";
import Header from "../components/header";

export default function OverTheBoard() {
    return (
        <>
            <Header />
            <Game gameMode="offline" />
        </>
    );
}
