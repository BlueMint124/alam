import { describe, expect, it } from "vitest";
import googleRouteFixture from "../../features/routes/providers/google/googleRoute.fixture.json";
import { normalizeGoogleRoute } from "../../features/routes/normalizers/normalizeGoogleRoute";
import type { GoogleRouteFixture } from "../../features/routes/types";

describe("normalizeGoogleRoute", () => {
  it("normalizes a Google route fixture into provider-agnostic route options", () => {
    const routeOptions = normalizeGoogleRoute(googleRouteFixture as GoogleRouteFixture);

    expect(routeOptions).toEqual([
      {
        provider: "google",
        providerRouteId: "google-route-1",
        summary: "Myeongdong Station to Seoul Station",
        durationMinutes: 18,
        departureTime: "2026-04-15T07:30:00+09:00",
        arrivalTime: "2026-04-15T07:48:00+09:00",
        segments: [
          {
            id: "google-route-1-segment-1",
            kind: "walk",
            instruction: "Walk to Myeongdong Station Exit 6",
          },
          {
            id: "google-route-1-segment-2",
            kind: "transit",
            instruction: "Subway Line 4 toward Danggogae",
            lineName: "Line 4",
            vehicleType: "subway",
            stopCount: 4,
          },
          {
            id: "google-route-1-segment-3",
            kind: "walk",
            instruction: "Walk to Seoul Station AREX platform",
          },
        ],
      },
    ]);
  });
});
