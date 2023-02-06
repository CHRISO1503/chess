import { useState, useEffect } from "react";

function getWindowDimensions() {
    const storedWidth = localStorage.getItem("window-width");
    const storedHeight = localStorage.getItem("window-height");
    const { innerWidth: width, innerHeight: height } = {
        innerWidth: storedWidth ? parseInt(storedWidth) : window.innerWidth,
        innerHeight: storedHeight ? parseInt(storedHeight) : window.innerHeight,
    };
    return {
        width,
        height,
    };
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );

    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        localStorage.setItem("window-width", windowDimensions.width.toString());
        localStorage.setItem(
            "window-height",
            windowDimensions.height.toString()
        );
    }, [windowDimensions]);

    return windowDimensions;
}
