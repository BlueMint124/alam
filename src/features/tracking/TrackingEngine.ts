import type { RouteTransitSegment } from "../routes/types";
import { ProgressEstimator } from "./ProgressEstimator";
import type {
  TrackingPositionEvent,
  TrackingProgressSnapshot,
  TrackingSessionState,
} from "./types";

export class TrackingEngine {
  private session: TrackingSessionState;

  constructor(
    session: TrackingSessionState,
    private readonly estimator = new ProgressEstimator(),
  ) {
    this.session = { ...session };
    this.getActiveTransitSegment();
  }

  applyPosition(event: TrackingPositionEvent): TrackingSessionState {
    const activeSegment = this.getActiveTransitSegment();

    if (event.segmentId && event.segmentId !== activeSegment.id) {
      return this.session;
    }

    const nextProgress = this.estimator.estimate(
      activeSegment,
      this.getProgressSnapshot(activeSegment),
      event,
    );

    if (!nextProgress.didUpdate) {
      return this.session;
    }

    this.session = {
      ...this.session,
      remainingStops: nextProgress.snapshot.remainingStops,
      lastStopIndex: nextProgress.snapshot.lastStopIndex,
      lastPositionEvent: nextProgress.snapshot.lastPositionEvent,
    };

    return this.session;
  }

  getState(): TrackingSessionState {
    return this.session;
  }

  private getActiveTransitSegment(): RouteTransitSegment {
    const activeSegment = this.session.route.segments.find(
      (segment): segment is RouteTransitSegment =>
        segment.id === this.session.activeSegmentId && segment.kind === "transit",
    );

    if (!activeSegment) {
      throw new Error(
        `Active transit segment not found for ${this.session.activeSegmentId}`,
      );
    }

    return activeSegment;
  }

  private getProgressSnapshot(
    activeSegment: RouteTransitSegment,
  ): TrackingProgressSnapshot {
    return {
      activeSegment,
      lastStopIndex: this.session.lastStopIndex,
      remainingStops: this.session.remainingStops,
      lastPositionEvent: this.session.lastPositionEvent,
    };
  }
}
