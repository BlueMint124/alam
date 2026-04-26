import React from "react";
import { useNavigate } from "react-router-dom";
import {
  configureDemoPlayback,
  resetDemoPlayback,
  setAlertOverlay,
  setAlertPresentationState,
  setPlaybackMode,
  setTrackingPresentationState,
  setTrackingView,
} from "../app/store/appStore";
import { demoSeoulTransferScenario } from "../features/simulation/SimulationLocationSource";

export function SettingsScreen() {
  const navigate = useNavigate();
  const [busThreshold, setBusThreshold] = React.useState(3);
  const [subwayThreshold, setSubwayThreshold] = React.useState(3);
  const [transferEnabled, setTransferEnabled] = React.useState(true);

  const handleLoadDemoScenario = () => {
    const totalEvents = demoSeoulTransferScenario.events.length;

    resetDemoPlayback(totalEvents);
    configureDemoPlayback({
      totalEvents,
      transferThreshold: subwayThreshold,
      finalThreshold: 1,
      transferEnabled,
    });
    setTrackingView({
      remainingStops: totalEvents,
      nextStopName: "다음 정거장",
      simulationPaused: false,
    });
    setAlertOverlay({
      isOpen: false,
      title: "",
      description: "",
      routeLabel: "",
      etaLabel: "",
    });
    setTrackingPresentationState("live");
    setAlertPresentationState("closing");
    setPlaybackMode("auto_playing");
    navigate("/tracking");
  };

  return (
    <section aria-label="설정 화면" className="screen screen--settings">
      <div className="settings-hero-card">
        <p className="hero-kicker">데모 설정</p>
        <h2 className="hero-title">알림 설정</h2>
        <p className="hero-copy">
          발표용 시나리오를 불러와 환승 전 알림과 목적지 전 알림 흐름을 바로 확인하세요.
        </p>
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

        <button
          type="button"
          className="primary-button"
          onClick={handleLoadDemoScenario}
          data-testid="demo-start"
        >
          데모 시나리오 불러오기
        </button>
      </div>
    </section>
  );
}
