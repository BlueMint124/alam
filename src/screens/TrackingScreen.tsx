import React from "react";
import { useAppStore } from "../app/store/appStore";
import { ArrivalAlertModal } from "../features/alerts/components/ArrivalAlertModal";
import { DebugPanel } from "../features/debug/DebugPanel";
import { PresenterControlBar } from "../features/presentation/PresenterControlBar";
import { usePlaybackController } from "../features/presentation/usePlaybackController";

export function TrackingScreen() {
  const trackingView = useAppStore((state) => state.trackingView);
  const alertOverlay = useAppStore((state) => state.alertOverlay);
  const presentation = useAppStore((state) => state.presentation);
  const demoPlayback = useAppStore((state) => state.demoPlayback);
  const playback = usePlaybackController();

  return (
    <section
      aria-label="추적 화면"
      className="screen screen--tracking"
      data-testid="tracking-screen"
      data-presentation={presentation.tracking}
      data-playback-mode={demoPlayback.mode}
    >
      <div className="tracking-hero-card">
        <p className="tracking-hero-card__kicker">live-trip</p>
        <div key={trackingView.remainingStops} className="tracking-hero-card__metric">
          <span data-testid="remaining-stops">{trackingView.remainingStops}</span>
          <small>stops-left</small>
        </div>
        <p className="tracking-hero-card__subtitle">
          next-stop: {trackingView.nextStopName}
        </p>
      </div>

      <div className="tracking-meta-grid">
        <article className="tracking-meta-card">
          <p className="tracking-meta-card__label">다음 알림</p>
          <strong className="tracking-meta-card__value">
            {alertOverlay.isOpen ? alertOverlay.title : "대기 중"}
          </strong>
        </article>
        <article className="tracking-meta-card">
          <p className="tracking-meta-card__label">재생 상태</p>
          <strong className="tracking-meta-card__value">{demoPlayback.mode}</strong>
        </article>
      </div>

      <PresenterControlBar
        mode={demoPlayback.mode}
        onPause={playback.pause}
        onResume={playback.resume}
        onStepForward={playback.stepForward}
        onRestart={playback.restart}
        onConfirmAlert={playback.confirmAlert}
        canConfirmAlert={alertOverlay.isOpen}
      />

      <DebugPanel controls={playback.controls} />

      <ArrivalAlertModal
        overlay={alertOverlay}
        presentationState={presentation.alert}
        onConfirm={playback.confirmAlert}
      />
    </section>
  );
}
