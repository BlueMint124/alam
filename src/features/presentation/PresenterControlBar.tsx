import type { PlaybackMode } from "./types";

type PresenterControlBarProps = {
  mode: PlaybackMode;
  onPause: () => void;
  onResume: () => void;
  onStepForward: () => void;
  onRestart: () => void;
  onConfirmAlert: () => void;
  canConfirmAlert: boolean;
};

export function PresenterControlBar({
  mode,
  onPause,
  onResume,
  onStepForward,
  onRestart,
  onConfirmAlert,
  canConfirmAlert,
}: PresenterControlBarProps) {
  return (
    <section className="presenter-control-bar" aria-label="presenter-controls">
      <button type="button" aria-label={mode === "paused" ? "resume" : "pause"} onClick={mode === "paused" ? onResume : onPause}>
        {mode === "paused" ? "resume" : "pause"}
      </button>
      <button type="button" aria-label="step" onClick={onStepForward}>
        step
      </button>
      <button type="button" aria-label="restart" onClick={onRestart}>
        restart
      </button>
      {canConfirmAlert ? (
        <button type="button" aria-label="confirm-alert" onClick={onConfirmAlert}>
          confirm-alert
        </button>
      ) : null}
    </section>
  );
}