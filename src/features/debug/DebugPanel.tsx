import type { SimulationControls } from "../simulation/useSimulationControls";

type DebugPanelProps = {
  controls: SimulationControls;
};

export function DebugPanel({ controls }: DebugPanelProps) {
  return (
    <aside aria-label="Simulation debug panel">
      <h2>Simulation debug</h2>
      <p>{controls.scenario.name}</p>
      <p>
        Replay progress: {controls.currentEventIndex} / {controls.totalEvents}
      </p>
      <p>Status: {controls.isComplete ? "complete" : "ready"}</p>
      <div>
        <button type="button" onClick={controls.nextEvent} disabled={controls.isComplete}>
          Next event
        </button>
        <button type="button" onClick={controls.resetScenario}>
          Reset
        </button>
      </div>
      {controls.lastEvent ? (
        <pre>{JSON.stringify(controls.lastEvent, null, 2)}</pre>
      ) : (
        <p>No events replayed yet.</p>
      )}
    </aside>
  );
}
