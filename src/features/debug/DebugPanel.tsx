import type { SimulationControls } from "../simulation/useSimulationControls";

type DebugPanelProps = {
  controls: SimulationControls;
};

export function DebugPanel({ controls }: DebugPanelProps) {
  return (
    <aside
      aria-label="시뮬레이션 디버그 패널"
      className="debug-panel debug-panel--compact"
      data-testid="live-activity"
    >
      <p className="debug-panel__status">scenario: {controls.scenario.name}</p>
      <p className="debug-panel__status">
        step: {controls.currentEventIndex} / {controls.totalEvents}
      </p>
      <p className="debug-panel__status">
        state: {controls.isComplete ? "complete" : "running"}
      </p>
      {controls.lastEvent ? (
        <pre className="debug-panel__event">{JSON.stringify(controls.lastEvent, null, 2)}</pre>
      ) : null}
    </aside>
  );
}
