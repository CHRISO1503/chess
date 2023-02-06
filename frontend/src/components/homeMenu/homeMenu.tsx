import "../../home.css";
import OnlineButton from "./onlineButton";
import OverTheBoardButton from "./overTheBoardButton";

export default function HomeMenu() {
    return (
        <div className="home-menu">
            <OnlineButton />
            <OverTheBoardButton />
        </div>
    );
}
