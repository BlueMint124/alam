import { beforeEach, describe, expect, it } from "vitest";
import { LocalStorageGateway, type StoredRoute } from "../../features/storage/LocalStorageGateway";

const mockStoredRoute: StoredRoute = {
  providerRouteId: "google-route-1",
  summary: "Myeongdong Station to Seoul Station",
  savedAt: "2026-04-16T13:30:00+09:00",
};

describe("LocalStorageGateway", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores and returns recent routes", () => {
    const gateway = new LocalStorageGateway(window.localStorage);

    gateway.saveRecent(mockStoredRoute);

    expect(gateway.getRecents()).toEqual([mockStoredRoute]);
  });

  it("stores and returns favorite routes", () => {
    const gateway = new LocalStorageGateway(window.localStorage);

    gateway.saveFavorite(mockStoredRoute);

    expect(gateway.getFavorites()).toEqual([mockStoredRoute]);
  });
});
