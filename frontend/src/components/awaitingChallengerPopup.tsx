import LoadingIcon from "./loadingIcon";

export default function () {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                alignItems: "center",
                width: "30vw",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    border: "2px solid black",
                    padding: "5px",
                    alignItems: "center",
                    background: "white",
                }}
            >
                <h1 style={{ marginTop: "0px" }}>Awaiting challenger...</h1>
                <LoadingIcon size={100} />
            </div>
        </div>
    );
}
