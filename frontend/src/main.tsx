import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/home";
import Online from "./routes/online";
import OverTheBoard from "./routes/overTheBoard";

const router = createHashRouter([
    { path: "/", element: <Home /> },
    { path: "/overtheboard", element: <OverTheBoard /> },
    { path: "/online", element: <Online /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <RouterProvider router={router} />
);
