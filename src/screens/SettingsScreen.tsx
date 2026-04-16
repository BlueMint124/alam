import React from "react";
import { AlertEngine, type AlertKind } from "../features/alerts/AlertEngine";
import { demoSeoulTransferScenario, SimulationLocationSource } from "../features/simulation/SimulationLocationSource";
import { setTrackingView } from "../app/store/appStore";

function toAlertLabel(kind: AlertKind): string {
  return kind === "TRANSFER" ? "Transfer alert" : "Near-arrival alert";
}

export function SettingsScreen() {
  const [busThreshold, setBusThreshold] = React.useState(3);
  const [subwayThreshold, setSubwayThreshold] = React.useState(3);
  const [transferEnabled, setTransferEnabled] = React.useState(true);
  const [demoAlerts, setDemoAlerts] = React.useState<string[]>([]);

  const handleLoadDemoScenario = () => {
    const source = new SimulationLocationSource(demoSeoulTransferScenario);
    const engine = new AlertEngine({
      transferEnabled,
      finalEnabled: true,
    });
    const emittedAlerts: AlertKind[] = [];
    const nextAlerts: string[] = [];

    let event = source.next();

    while (event) {
      const remainingStops = Math.max(0, source.getTotalEvents() - event.stopIndex);
      const alerts = engine.evaluate({
        remainingStops,
        transferThreshold: subwayThreshold,
        finalThreshold: 1,
        emittedAlerts,
      });

      alerts.forEach((alert) => {
        emittedAlerts.push(alert.kind);
        nextAlerts.push(toAlertLabel(alert.kind));
      });

      event = source.next();
    }

    setTrackingView({
      remainingStops: 0,
      nextStopName: "Seoul Station",
      simulationPaused: false,
    });
    setDemoAlerts(nextAlerts);
  };

  return (
    <section aria-label="Settings screen">
      <h2>Settings</h2>
      <label>
        Bus alert threshold
        <input
          type="range"
          min="3"
          max="5"
          value={busThreshold}
          onChange={(event) => setBusThreshold(Number(event.target.value))}
        />
      </label>
      <label>
        Subway alert threshold
        <input
          type="range"
          min="3"
          max="4"
          value={subwayThreshold}
          onChange={(event) => setSubwayThreshold(Number(event.target.value))}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={transferEnabled}
          onChange={(event) => setTransferEnabled(event.target.checked)}
        />
        Enable transfer warning
      </label>
      <button type="button" onClick={handleLoadDemoScenario}>
        Load Demo Scenario
      </button>
      {demoAlerts.length > 0 ? (
        <div aria-label="Demo alerts">
          {demoAlerts.map((alert) => (
            <p key={alert}>{alert}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}


