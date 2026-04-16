import React from "react";
import { toggleSimulationPaused, useAppStore } from "../app/store/appStore";

export function TrackingScreen() {
  const trackingView = useAppStore((state) => state.trackingView);

  return (
    <section aria-label="Tracking screen">
      <h2>{trackingView.remainingStops} stops left</h2>
      <p>Next stop: {trackingView.nextStopName}</p>
      <button type="button" onClick={toggleSimulationPaused}>
        {trackingView.simulationPaused ? "Resume Simulation" : "Pause Simulation"}
      </button>
    </section>
  );
}
