import { useEffect, useState } from "react";
import { blackAssets, sizeMultipliers } from "./game/piece";

export default function ({ size }: { size: number }) {
    const [assetIndex, setAssetIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (assetIndex < blackAssets.length - 1) {
                setAssetIndex(assetIndex + 1);
            } else {
                setAssetIndex(0);
            }
        }, 400);
        return () => clearInterval(interval);
    });
    return (
        <div
            style={{
                width: size,
                height: size,
                display: "flex",
                justifyContent: "center",
            }}
        >
            <img
                src={blackAssets[assetIndex]}
                style={{
                    width: size * sizeMultipliers[assetIndex],
                    userSelect: "none",
                }}
                draggable="false"
            />
        </div>
    );
}
