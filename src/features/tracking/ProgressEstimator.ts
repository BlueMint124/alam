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
    const previousTimestamp = this.parseTimestamp(
      previousSnapshot.lastPositionEvent?.timestamp,
    );
    const nextTimestamp = this.parseTimestamp(event.timestamp);

    if (
      previousTimestamp !== null &&
      nextTimestamp !== null &&
      nextTimestamp < previousTimestamp
    ) {
      return {
        didAdvance: false,
        didUpdate: false,
        snapshot: previousSnapshot,
      };
    }

    const nextWatermark =
      nextTimestamp === null ? previousSnapshot.lastPositionEvent : event;
    const watermarkSnapshot: TrackingProgressSnapshot = {
      ...previousSnapshot,
      lastPositionEvent: nextWatermark,
    };
    const didUpdateWatermark = nextWatermark !== previousSnapshot.lastPositionEvent;

    if (!Number.isInteger(event.stopIndex) || event.stopIndex < 0) {
      return {
        didAdvance: false,
        didUpdate: didUpdateWatermark,
        snapshot: watermarkSnapshot,
      };
    }

    if (event.stopIndex > segment.stopCount) {
      return {
        didAdvance: false,
        didUpdate: didUpdateWatermark,
        snapshot: watermarkSnapshot,
      };
    }

    if (event.stopIndex <= (previousSnapshot.lastStopIndex ?? -1)) {
      return {
        didAdvance: false,
        didUpdate: didUpdateWatermark,
        snapshot: watermarkSnapshot,
      };
    }

    return {
      didAdvance: true,
      didUpdate: true,
      snapshot: {
        activeSegment: segment,
        lastStopIndex: event.stopIndex,
        remainingStops: Math.max(0, segment.stopCount - event.stopIndex),
        lastPositionEvent: nextWatermark,
      },
    };
  }

  private parseTimestamp(timestamp?: string): number | null {
    if (!timestamp) {
      return null;
    }

    const parsedTimestamp = Date.parse(timestamp);

    return Number.isNaN(parsedTimestamp) ? null : parsedTimestamp;
  }
}
