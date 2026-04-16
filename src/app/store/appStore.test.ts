import { beforeEach, describe, expect, it } from "vitest";
import { getAppStoreState, resetAppStore, selectRoute, startBoarding } from "./appStore";

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
});
