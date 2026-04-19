import React from "react";
import { AlertEngine, type AlertKind } from "../features/alerts/AlertEngine";
import { ArrivalAlertModal } from "../features/alerts/components/ArrivalAlertModal";
import { demoSeoulTransferScenario, SimulationLocationSource } from "../features/simulation/SimulationLocationSource";
import { advanceAlertQueue, setAlertQueue, setTrackingView, useAppStore } from "../app/store/appStore";

function toAlertOverlay(kind: AlertKind, subwayThreshold: number) {
  if (kind === "TRANSFER") {
    return {
      isOpen: true,
      title: "곧 환승할 시간이에요",
      description: `환승까지 ${subwayThreshold}정거장 남았어요`,
      routeLabel: "4호선 오이도행",
      etaLabel: "곧 도착",
    };
  }

  return {
    isOpen: true,
    title: "곧 내릴 시간이에요",
    description: "서울역까지 2정거장 남았어요",
    routeLabel: "서울역",
    etaLabel: "2분 후",
  };
}

export function SettingsScreen() {
  const [busThreshold, setBusThreshold] = React.useState(3);
  const [subwayThreshold, setSubwayThreshold] = React.useState(3);
  const [transferEnabled, setTransferEnabled] = React.useState(true);
  const [demoAlerts, setDemoAlerts] = React.useState<string[]>([]);
  const alertOverlay = useAppStore((state) => state.alertOverlay);

  const handleLoadDemoScenario = () => {
    const source = new SimulationLocationSource(demoSeoulTransferScenario);
    const engine = new AlertEngine({
      transferEnabled,
      finalEnabled: true,
    });
    const emittedAlerts: AlertKind[] = [];
    const nextAlerts: ReturnType<typeof toAlertOverlay>[] = [];

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
        nextAlerts.push(toAlertOverlay(alert.kind, subwayThreshold));
      });

      event = source.next();
    }

    setTrackingView({
      remainingStops: 2,
      nextStopName: "서울역",
      simulationPaused: false,
    });
    setAlertQueue(nextAlerts);
    setDemoAlerts(nextAlerts.map((alert) => alert.title));
  };

  return (
    <section aria-label="설정 화면" className="screen screen--settings">
      <div className="settings-hero-card">
        <p className="hero-kicker">데모 설정</p>
        <h2 className="hero-title">알림 설정</h2>
        <p className="hero-copy">발표용 시나리오를 불러와 환승 전 알림과 목적지 전 알림 흐름을 바로 확인하세요.</p>
      </div>

      <div className="settings-card">
        <label className="settings-control">
          <span className="settings-control__labelRow">
            <span className="section-heading">버스 알림 시점</span>
            <span className="section-headingMeta">{busThreshold}정거장 전</span>
          </span>
          <input
            aria-label="버스 알림 시점"
            className="settings-slider"
            type="range"
            min="3"
            max="5"
            value={busThreshold}
            onChange={(event) => setBusThreshold(Number(event.target.value))}
          />
        </label>

        <label className="settings-control">
          <span className="settings-control__labelRow">
            <span className="section-heading">지하철 알림 시점</span>
            <span className="section-headingMeta">{subwayThreshold}정거장 전</span>
          </span>
          <input
            aria-label="지하철 알림 시점"
            className="settings-slider"
            type="range"
            min="3"
            max="4"
            value={subwayThreshold}
            onChange={(event) => setSubwayThreshold(Number(event.target.value))}
          />
        </label>

        <label className="settings-toggle">
          <input
            aria-label="환승 전 알림 사용"
            type="checkbox"
            checked={transferEnabled}
            onChange={(event) => setTransferEnabled(event.target.checked)}
          />
          <span>환승 전 알림 사용</span>
        </label>

        <button type="button" className="primary-button" onClick={handleLoadDemoScenario}>
          데모 시나리오 불러오기
        </button>
      </div>

      {demoAlerts.length > 0 ? (
        <section className="settings-card" aria-label="데모 알림 목록">
          <div className="section-headingRow">
            <h3 className="section-heading">데모 알림 순서</h3>
            <span className="section-headingMeta">총 {demoAlerts.length}개</span>
          </div>
          <div className="settings-alert-list">
            {demoAlerts.map((alert) => (
              <span key={alert} className="settings-alert-chip">
                {alert}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <ArrivalAlertModal overlay={alertOverlay} onConfirm={advanceAlertQueue} />
    </section>
  );
}
