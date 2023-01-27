import { useEffect, useState } from "react";
import { pieceWidth, tileWidth } from "../home";
import { Promotion } from "./gameLogic";
import { sizeMultipliers, whiteAssets, blackAssets } from "./piece";

export default function PromotePopup({
    promotion,
    isWhitesTurn,
    setPromotion,
}: {
    promotion?: Promotion;
    isWhitesTurn: boolean;
    setPromotion: (value: Promotion) => void;
}) {
    const [promotionAssets, setPromotionAssets] = useState([] as string[]);
    const pieces = ["N", "B", "R", "Q"];

    useEffect(() => {
        if (isWhitesTurn) {
            setPromotionAssets(whiteAssets.slice(1, 5));
        } else {
            setPromotionAssets(blackAssets.slice(1, 5));
        }
    }, []);

    return (
        <>
            {promotion ? (
                <div
                    style={{
                        position: "absolute",
                        left:
                            tileWidth *
                            (promotion.at != null ? promotion.at + 1 : 0),
                        top: isWhitesTurn ? 0 : tileWidth * 4,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {promotionAssets.map((asset, i) => (
                        <div
                            key={i}
                            style={{
                                width: tileWidth,
                                height: tileWidth,
                                display: "flex",
                                justifyContent: "center",
                                backgroundColor: "black",
                            }}
                            onClick={() => {
                                setPromotion({
                                    promotion: false,
                                    at: promotion.at,
                                    piece: pieces[i],
                                });
                            }}
                        >
                            <img
                                key={i}
                                src={asset}
                                style={{
                                    width: `${pieceWidth * sizeMultipliers[i]}`,
                                    userSelect: "none",
                                }}
                                draggable="false"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
