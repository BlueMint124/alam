import React from "react";
import { HomeScreen } from "../screens/HomeScreen";

export function App() {
  return (
    <div className="app-stage">
      <div className="app-shell">
        <header className="app-bar">
          <h1>ArriveHae</h1>
        </header>
        <main className="app-main">
          <HomeScreen />
        </main>
      </div>
    </div>
  );
}
