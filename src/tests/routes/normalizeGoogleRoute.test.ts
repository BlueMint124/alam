import { describe, expect, it } from "vitest";
import googleRouteFixture from "../../features/routes/providers/google/googleRoute.fixture.json";
import { normalizeGoogleRoute } from "../../features/routes/normalizers/normalizeGoogleRoute";

describe("normalizeGoogleRoute", () => {
  it("normalizes a Google route fixture into provider-agnostic route options", () => {
    const routeOptions = normalizeGoogleRoute(googleRouteFixture);

    expect(routeOptions).toEqual([
      {
        provider: "google",
        providerRouteId: "google-route-1",
        summary: "Myeongdong Station to Seoul Station",
        durationMinutes: 18,
        departureTime: "2026-04-15T07:30:00+09:00",
        arrivalTime: "2026-04-15T07:48:00+09:00",
      },
    ]);
  });
});
