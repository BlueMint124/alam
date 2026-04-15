import { describe, expect, it } from "vitest";
import type { RouteOption } from "../../features/routes/types";
import { TrackingEngine } from "../../features/tracking/TrackingEngine";
import type { TrackingSessionState } from "../../features/tracking/types";

const route: RouteOption = {
  provider: "google",
  providerRouteId: "google-route-1",
  summary: "Myeongdong Station to Seoul Station",
  durationMinutes: 18,
  departureTime: "2026-04-15T07:30:00+09:00",
  arrivalTime: "2026-04-15T07:48:00+09:00",
  segments: [
    {
      id: "segment-1",
      kind: "walk",
      instruction: "Walk to Myeongdong Station Exit 6",
    },
    {
      id: "segment-2",
      kind: "transit",
      instruction: "Subway Line 4 toward Danggogae",
      lineName: "Line 4",
      vehicleType: "subway",
      stopCount: 4,
    },
    {
      id: "segment-3",
      kind: "walk",
      instruction: "Walk to Seoul Station AREX platform",
    },
  ],
};

function createSessionState(): TrackingSessionState {
  return {
    route,
    activeSegmentId: "segment-2",
    remainingStops: 4,
    lastStopIndex: null,
    lastPositionEvent: null,
  };
}

describe("TrackingEngine", () => {
  it("reduces remaining stops as position events advance", () => {
    const engine = new TrackingEngine(createSessionState());

    engine.applyPosition({
      stopIndex: 1,
      segmentId: "segment-2",
      timestamp: "2026-04-15T07:34:00+09:00",
    });

    expect(engine.getState().remainingStops).toBe(3);

    engine.applyPosition({
      stopIndex: 3,
      segmentId: "segment-2",
      timestamp: "2026-04-15T07:40:00+09:00",
    });

    expect(engine.getState().remainingStops).toBe(1);
  });

  it("clamps remaining stops at zero when position events move beyond the segment stop count", () => {
    const engine = new TrackingEngine(createSessionState());

    engine.applyPosition({
      stopIndex: 10,
      segmentId: "segment-2",
      timestamp: "2026-04-15T07:44:00+09:00",
    });

    expect(engine.getState().remainingStops).toBe(0);
    expect(engine.getState().lastStopIndex).toBe(10);
  });

  it("ignores repeated or non-advancing stop indices", () => {
    const engine = new TrackingEngine(createSessionState());

    engine.applyPosition({
      stopIndex: 2,
      segmentId: "segment-2",
      timestamp: "2026-04-15T07:38:00+09:00",
    });

    expect(engine.getState().remainingStops).toBe(2);

    engine.applyPosition({
      stopIndex: 2,
      segmentId: "segment-2",
      timestamp: "2026-04-15T07:39:00+09:00",
    });

    engine.applyPosition({
      stopIndex: 1,
      segmentId: "segment-2",
      timestamp: "2026-04-15T07:40:00+09:00",
    });

    expect(engine.getState().remainingStops).toBe(2);
    expect(engine.getState().lastStopIndex).toBe(2);
  });
});
