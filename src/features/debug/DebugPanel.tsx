import type { SimulationControls } from "../simulation/useSimulationControls";

type DebugPanelProps = {
  controls: SimulationControls;
};

export function DebugPanel({ controls }: DebugPanelProps) {
  return (
    <aside aria-label="시뮬레이션 디버그 패널" className="debug-panel">
      <div className="section-headingRow">
        <h2 className="section-heading">시뮬레이션 디버그</h2>
        <span className="section-headingMeta">{controls.scenario.name}</span>
      </div>
      <p className="debug-panel__status">재생 진행률: {controls.currentEventIndex} / {controls.totalEvents}</p>
      <p className="debug-panel__status">상태: {controls.isComplete ? "완료" : "대기 중"}</p>
      <div className="debug-panel__actions">
        <button type="button" className="secondary-button" onClick={controls.nextEvent} disabled={controls.isComplete}>
          다음 이벤트
        </button>
        <button type="button" className="ghost-button" onClick={controls.resetScenario}>
          처음부터 다시
        </button>
      </div>
      {controls.lastEvent ? (
        <pre className="debug-panel__event">{JSON.stringify(controls.lastEvent, null, 2)}</pre>
      ) : (
        <p className="debug-panel__status">아직 재생된 이벤트가 없어요.</p>
      )}
    </aside>
  );
}
