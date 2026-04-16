import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { App } from "./App";
import { TrackingScreen } from "../screens/TrackingScreen";
import { SettingsScreen } from "../screens/SettingsScreen";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/tracking",
    element: <TrackingScreen />,
  },
  {
    path: "/settings",
    element: <SettingsScreen />,
  },
];

export const router = createBrowserRouter(appRoutes);
