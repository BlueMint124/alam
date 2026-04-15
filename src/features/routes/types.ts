export type RouteProvider = "google";

export type RouteSegment = RouteWalkSegment | RouteTransitSegment;

export type RouteWalkSegment = {
  id: string;
  kind: "walk";
  instruction: string;
};

export type RouteTransitSegment = {
  id: string;
  kind: "transit";
  instruction: string;
  lineName: string;
  vehicleType: "subway" | "bus" | "train";
  stopCount: number;
};

export type RouteOption = {
  provider: RouteProvider;
  providerRouteId: string;
  summary: string;
  durationMinutes: number;
  departureTime: string;
  arrivalTime: string;
  segments: RouteSegment[];
};

export type GoogleRouteFixture = {
  routes: Array<{
    id: string;
    summary: string;
    durationMinutes: number;
    departureTime: string;
    arrivalTime: string;
    segments: RouteSegment[];
  }>;
};
