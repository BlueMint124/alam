import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  configureDemoPlayback,
  resetAppStore,
  setPlaybackMode,
  useAppStore,
} from "../../app/store/appStore";
import { usePlaybackController } from "./usePlaybackController";

function PlaybackHarness() {
  const playback = usePlaybackController();
  const state = useAppStore((store) => store);

  return (
    <div>
      <p>mode:{state.demoPlayback.mode}</p>
      <p>remaining:{state.trackingView.remainingStops}</p>
      <p>alert:{state.alertOverlay.title || "none"}</p>
      <button type="button" onClick={playback.confirmAlert}>
        confirm
      </button>
    </div>
  );
}

describe("usePlaybackController", () => {
  beforeEach(() => {
    resetAppStore();
    configureDemoPlayback({
      totalEvents: 4,
      transferThreshold: 3,
      finalThreshold: 1,
      transferEnabled: true,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("autoplays until an alert opens and resumes after confirmation", () => {
    setPlaybackMode("auto_playing");

    render(<PlaybackHarness />);

    act(() => {
      vi.advanceTimersByTime(1400);
      vi.advanceTimersByTime(1400);
    });

    expect(screen.getByText("mode:alert_open")).toBeInTheDocument();
    expect(screen.getByText(/alert:transfer-alert/)).toBeInTheDocument();

    act(() => {
      screen.getByRole("button", { name: "confirm" }).click();
    });

    expect(screen.getByText("mode:auto_playing")).toBeInTheDocument();
  });
});
