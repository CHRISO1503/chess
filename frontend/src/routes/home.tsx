import Header from "../components/header";
import HomeMenu from "../components/homeMenu/homeMenu";
import useWindowDimensions from "../getWindowDimensions";

export default function Home() {
    const { height, width } = useWindowDimensions();
    return (
        <>
            <Header />
            <HomeMenu />
        </>
    );
}
