import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { App } from "./App";
import { TrackingScreen } from "../screens/TrackingScreen";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/tracking",
    element: <TrackingScreen />,
  },
];

export const router = createBrowserRouter(appRoutes);
