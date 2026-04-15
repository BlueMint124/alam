import type { RouteTransitSegment } from "../routes/types";
import type {
  TrackingEstimateResult,
  TrackingPositionEvent,
  TrackingProgressSnapshot,
} from "./types";

export class ProgressEstimator {
  estimate(
    segment: RouteTransitSegment,
    previousSnapshot: TrackingProgressSnapshot,
    event: TrackingPositionEvent,
  ): TrackingEstimateResult {
    if (!Number.isInteger(event.stopIndex) || event.stopIndex < 0) {
      return {
        didAdvance: false,
        snapshot: previousSnapshot,
      };
    }

    if (this.isStaleEvent(previousSnapshot.lastPositionEvent, event)) {
      return {
        didAdvance: false,
        snapshot: previousSnapshot,
      };
    }

    if (event.stopIndex <= (previousSnapshot.lastStopIndex ?? -1)) {
      return {
        didAdvance: false,
        snapshot: previousSnapshot,
      };
    }

    return {
      didAdvance: true,
      snapshot: {
        activeSegment: segment,
        lastStopIndex: event.stopIndex,
        remainingStops: Math.max(0, segment.stopCount - event.stopIndex),
        lastPositionEvent: event,
      },
    };
  }

  private isStaleEvent(
    previousEvent: TrackingPositionEvent | null,
    nextEvent: TrackingPositionEvent,
  ): boolean {
    const previousTime = this.parseTimestamp(previousEvent?.timestamp);
    const nextTime = this.parseTimestamp(nextEvent.timestamp);

    if (previousTime === null || nextTime === null) {
      return false;
    }

    return nextTime < previousTime;
  }

  private parseTimestamp(timestamp?: string): number | null {
    if (!timestamp) {
      return null;
    }

    const parsedTimestamp = Date.parse(timestamp);

    return Number.isNaN(parsedTimestamp) ? null : parsedTimestamp;
  }
}
