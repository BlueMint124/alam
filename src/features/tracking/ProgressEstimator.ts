import type { RouteTransitSegment } from "../routes/types";
import type { TrackingProgressSnapshot, TrackingPositionEvent } from "./types";

export class ProgressEstimator {
  estimate(
    segment: RouteTransitSegment,
    previousSnapshot: TrackingProgressSnapshot,
    event: TrackingPositionEvent,
  ): TrackingProgressSnapshot {
    if (event.stopIndex <= (previousSnapshot.lastStopIndex ?? -1)) {
      return previousSnapshot;
    }

    return {
      activeSegment: segment,
      lastStopIndex: event.stopIndex,
      remainingStops: Math.max(0, segment.stopCount - event.stopIndex),
    };
  }
}
