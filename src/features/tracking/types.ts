import type { RouteOption, RouteTransitSegment } from "../routes/types";

export type TrackingPositionEvent = {
  stopIndex: number;
  segmentId?: string;
  timestamp?: string;
};

export type TrackingSessionState = {
  route: RouteOption;
  activeSegmentId: string;
  remainingStops: number;
  lastStopIndex: number | null;
  lastPositionEvent: TrackingPositionEvent | null;
};

export type TrackingProgressSnapshot = {
  activeSegment: RouteTransitSegment;
  lastStopIndex: number | null;
  remainingStops: number;
};
