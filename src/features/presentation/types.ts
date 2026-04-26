export type PlaybackMode =
  | "idle"
  | "auto_playing"
  | "paused"
  | "alert_open"
  | "completed";

export type HomePresentationState = "entered" | "searching" | "results_ready";

export type ResultsPresentationState =
  | "list_revealed"
  | "route_selected"
  | "detail_expanded";

export type TrackingPresentationState = "live" | "countdown_updated" | "paused";

export type AlertPresentationState = "opening" | "active" | "closing";

export type PresentationState = {
  home: HomePresentationState;
  results: ResultsPresentationState;
  tracking: TrackingPresentationState;
  alert: AlertPresentationState;
};

export type DemoPlaybackState = {
  mode: PlaybackMode;
  currentEventIndex: number;
  totalEvents: number;
  transferThreshold: number;
  finalThreshold: number;
  transferEnabled: boolean;
};
