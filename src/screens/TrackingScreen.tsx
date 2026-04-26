import React from "react";
import { advanceAlertQueue, toggleSimulationPaused, useAppStore } from "../app/store/appStore";
import { ArrivalAlertModal } from "../features/alerts/components/ArrivalAlertModal";

export function TrackingScreen() {
  const trackingView = useAppStore((state) => state.trackingView);
  const alertOverlay = useAppStore((state) => state.alertOverlay);
  const playbackMode = useAppStore((state) => state.demoPlayback.mode);

  return (
    <section
      aria-label="추적 화면"
      className="screen screen--tracking"
      data-testid="tracking-screen"
      data-playback-mode={playbackMode}
    >
      <div className="tracking-hero-card">
        <p className="tracking-hero-card__kicker">현재 탑승 중</p>
        <h2 className="tracking-hero-card__title">{trackingView.remainingStops}정거장 남았어요</h2>
        <p className="tracking-hero-card__subtitle">다음 하차: {trackingView.nextStopName}</p>
      </div>

      <div className="tracking-meta-grid">
        <article className="tracking-meta-card">
          <p className="tracking-meta-card__label">다음 알림</p>
          <strong className="tracking-meta-card__value">{alertOverlay.isOpen ? alertOverlay.title : "대기 중"}</strong>
        </article>
        <article className="tracking-meta-card">
          <p className="tracking-meta-card__label">시뮬레이션 상태</p>
          <strong className="tracking-meta-card__value">
            {trackingView.simulationPaused ? "일시정지됨" : "이동 중"}
          </strong>
        </article>
      </div>

      <button type="button" className="secondary-button" onClick={toggleSimulationPaused}>
        {trackingView.simulationPaused ? "시뮬레이션 다시 시작" : "시뮬레이션 일시정지"}
      </button>

      <ArrivalAlertModal overlay={alertOverlay} onConfirm={advanceAlertQueue} />
    </section>
  );
}
