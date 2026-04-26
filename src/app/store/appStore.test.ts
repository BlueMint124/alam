import { beforeEach, describe, expect, it } from "vitest";
import {
  advanceAlertQueue,
  configureDemoPlayback,
  getAppStoreState,
  resetAppStore,
  selectRoute,
  setAlertPresentationState,
  setAlertQueue,
  setHomePresentationState,
  setPlaybackMode,
  setResultsPresentationState,
  setTrackingPresentationState,
  startBoarding,
} from "./appStore";

describe("appStore", () => {
  beforeEach(() => {
    resetAppStore();
  });

  it("keeps boarding state when selecting a different route", () => {
    startBoarding("google-route-1");

    selectRoute("google-route-2");

    expect(getAppStoreState()).toMatchObject({
      selectedRouteId: "google-route-2",
      boardingRouteId: "google-route-1",
    });
  });

  it("advances queued alerts and clears the overlay after the last item", () => {
    setAlertQueue([
      {
        isOpen: true,
        title: "\uace7\u0020\ud658\uc2b9\ud560\u0020\uc2dc\uac04\uc774\uc5d0\uc694",
        description: "\ud658\uc2b9\uae4c\uc9c0\u0020\u0032\uc815\uac70\uc7a5\u0020\ub0a8\uc558\uc5b4\uc694",
        routeLabel: "\u0034\ud638\uc120\u0020\uc624\uc774\ub3c4\ud589",
        etaLabel: "\u0032\ubd84\u0020\ud6c4",
      },
      {
        isOpen: true,
        title: "\uace7\u0020\ub0b4\ub9b4\u0020\uc2dc\uac04\uc774\uc5d0\uc694",
        description: "\uc11c\uc6b8\uc5ed\uae4c\uc9c0\u0020\u0032\uc815\uac70\uc7a5\u0020\ub0a8\uc558\uc5b4\uc694",
        routeLabel: "\uc11c\uc6b8\uc5ed",
        etaLabel: "\u0032\ubd84\u0020\ud6c4",
      },
    ]);

    expect(getAppStoreState().alertOverlay.title).toBe("\uace7\u0020\ud658\uc2b9\ud560\u0020\uc2dc\uac04\uc774\uc5d0\uc694");

    advanceAlertQueue();

    expect(getAppStoreState().alertOverlay.title).toBe("\uace7\u0020\ub0b4\ub9b4\u0020\uc2dc\uac04\uc774\uc5d0\uc694");

    advanceAlertQueue();

    expect(getAppStoreState().alertOverlay.isOpen).toBe(false);
    expect(getAppStoreState().alertQueue).toEqual([]);
  });

  it("tracks presentation and playback state and resets both to defaults", () => {
    setHomePresentationState("searching");
    setResultsPresentationState("detail_expanded");
    setTrackingPresentationState("countdown_updated");
    setAlertPresentationState("opening");
    configureDemoPlayback({
      totalEvents: 4,
      transferThreshold: 3,
      finalThreshold: 1,
      transferEnabled: true,
    });
    setPlaybackMode("auto_playing");

    expect(getAppStoreState().presentation).toEqual({
      home: "searching",
      results: "detail_expanded",
      tracking: "countdown_updated",
      alert: "opening",
    });

    expect(getAppStoreState().demoPlayback).toMatchObject({
      mode: "auto_playing",
      totalEvents: 4,
      transferThreshold: 3,
    });

    resetAppStore();

    expect(getAppStoreState().presentation).toEqual({
      home: "entered",
      results: "list_revealed",
      tracking: "live",
      alert: "closing",
    });

    expect(getAppStoreState().demoPlayback.mode).toBe("idle");
  });
});