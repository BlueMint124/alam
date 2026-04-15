import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { App } from "./App";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
];

export const router = createBrowserRouter(appRoutes);