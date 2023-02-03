import { useEffect, useState } from "react";
import Game, {
    cloneGrid,
    initialiseBoardMapAndMoveMap,
    SquareInfo,
} from "../components/game/game";
import Header from "../components/header";

export default function OverTheBoard() {
    const [boardMap, setBoardMap] = useState([] as SquareInfo[][]);
    const [moveMap, setMoveMap] = useState([] as boolean[][]);
    const [isWhitesTurn, setIsWhitesTurn] = useState(true);
    const [clickedSquare, setClickedSquare] = useState([] as number[]);
    const [kingsMoved, setKingsMoved] = useState([false, false]);
    const [rooksMoved, setRooksMoved] = useState([
        [false, false],
        [false, false],
    ]);
    const [passant, setPassant] = useState({ passantable: false, at: 0 });

    useEffect(() => {
        setBoardMap(cloneGrid(initialiseBoardMapAndMoveMap().boardMap));
        setMoveMap(cloneGrid(initialiseBoardMapAndMoveMap().moveMap));
    }, []);

    return (
        <>
            <Header />
            <Game
                boardMap={boardMap}
                setBoardMap={setBoardMap}
                moveMap={moveMap}
                setMoveMap={setMoveMap}
                boardFlipped={false}
                isWhitesTurn={isWhitesTurn}
                setIsWhitesTurn={setIsWhitesTurn}
                clickedSquare={clickedSquare}
                setClickedSquare={setClickedSquare}
                kingsMoved={kingsMoved}
                setKingsMoved={setKingsMoved}
                rooksMoved={rooksMoved}
                setRooksMoved={setRooksMoved}
                passant={passant}
                setPassant={setPassant}
            />
        </>
    );
}
