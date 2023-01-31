import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/home";
import Online from "./routes/online";
import OnlineGame from "./routes/onlineGame";
import OverTheBoard from "./routes/overTheBoard";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/overtheboard", element: <OverTheBoard /> },
    { path: "/online", element: <Online /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <RouterProvider router={router} />
);
