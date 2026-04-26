import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  configureDemoPlayback,
  resetAppStore,
  setAlertOverlay,
  setAlertPresentationState,
  setPlaybackMode,
  setTrackingPresentationState,
  setTrackingView,
} from "../app/store/appStore";
import { TrackingScreen } from "./TrackingScreen";

describe("TrackingScreen dynamic playback", () => {
  beforeEach(() => {
    resetAppStore();
  });

  it("shows live playback state and resumes after alert confirmation", () => {
    configureDemoPlayback({
      totalEvents: 4,
      transferThreshold: 3,
      finalThreshold: 1,
      transferEnabled: true,
    });
    setPlaybackMode("alert_open");
    setTrackingPresentationState("countdown_updated");
    setAlertPresentationState("active");
    setTrackingView({
      remainingStops: 2,
      nextStopName: "seoul-station",
      simulationPaused: false,
    });
    setAlertOverlay({
      isOpen: true,
      title: "transfer-alert",
      description: "remaining-2",
      routeLabel: "line-4",
      etaLabel: "soon",
    });

    render(<TrackingScreen />);

    expect(screen.getByTestId("tracking-screen")).toHaveAttribute(
      "data-playback-mode",
      "alert_open",
    );
    expect(screen.getByRole("button", { name: "pause" })).toBeInTheDocument();
    expect(screen.getByTestId("alert-modal")).toHaveAttribute("data-state", "active");

    fireEvent.click(screen.getByRole("button", { name: "confirm-alert" }));

    expect(screen.getByTestId("tracking-screen")).toHaveAttribute(
      "data-playback-mode",
      "auto_playing",
    );
  });
});
