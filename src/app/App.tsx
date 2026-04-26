import React from "react";
import { Outlet } from "react-router-dom";
import { AppTabBar } from "../features/ui/AppTabBar";

export function App() {
  return (
    <div className="app-stage">
      <div className="app-shell">
        <header className="app-bar">
          <div className="app-bar__brand">
            <span className="app-bar__eyebrow">Transit Alarm</span>
            <h1 className="app-bar__title">ArriveHae</h1>
          </div>
          <span aria-hidden="true" className="app-bar__badge">
            LIVE
          </span>
        </header>
        <main className="app-main">
          <Outlet />
        </main>
        <AppTabBar />
      </div>
    </div>
  );
}