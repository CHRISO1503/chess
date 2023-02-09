import { useState } from "react";

export default function LobbyPasswordPopup({
    enterLobby,
    setRequirePassword,
}: {
    enterLobby: () => void;
    setRequirePassword: (value: boolean) => void;
}) {
    const [passwordInput, setPasswordInput] = useState("");
    const [errorMessage, setErrorMessage] = useState(" ");

    function handleSubmit() {
        if (passwordInput) {
            enterLobby();
            setRequirePassword(false);
        } else {
            setErrorMessage("Password incorrect");
        }
    }

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                style={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    border: "2px solid black",
                    padding: "5px",
                }}
            >
                <label>Enter game password</label>
                <input
                    type="password"
                    onChange={(e) => setPasswordInput(e.target.value)}
                />
                <div style={{ margin: "10px" }}>
                    <input type="submit" style={{ float: "right" }} />
                    <input
                        type="button"
                        value="Cancel"
                        onClick={() => setRequirePassword(false)}
                    />
                </div>
            </form>
            {errorMessage}
        </div>
    );
}
