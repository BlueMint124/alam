import React from "react";
import { Outlet } from "react-router-dom";
import { AppTabBar } from "../features/ui/AppTabBar";

export function App() {
  return (
    <div className="app-stage">
      <div className="app-shell">
        <header className="app-bar">
          <h1>ArriveHae</h1>
        </header>
        <main className="app-main">
          <Outlet />
        </main>
        <AppTabBar />
      </div>
    </div>
  );
}