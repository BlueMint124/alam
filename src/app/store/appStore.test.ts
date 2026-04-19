import { beforeEach, describe, expect, it } from "vitest";
import {
  advanceAlertQueue,
  getAppStoreState,
  resetAppStore,
  selectRoute,
  setAlertQueue,
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
        title: "곧 환승할 시간이에요",
        description: "환승까지 2정거장 남았어요",
        routeLabel: "4호선 오이도행",
        etaLabel: "곧 도착",
      },
      {
        isOpen: true,
        title: "곧 내릴 시간이에요",
        description: "서울역까지 2정거장 남았어요",
        routeLabel: "서울역",
        etaLabel: "2분 후",
      },
    ]);

    expect(getAppStoreState().alertOverlay.title).toBe("곧 환승할 시간이에요");

    advanceAlertQueue();

    expect(getAppStoreState().alertOverlay.title).toBe("곧 내릴 시간이에요");

    advanceAlertQueue();

    expect(getAppStoreState().alertOverlay.isOpen).toBe(false);
    expect(getAppStoreState().alertQueue).toEqual([]);
  });
});
