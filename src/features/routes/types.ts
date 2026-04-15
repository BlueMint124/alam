export type RouteProvider = "google";

export type RouteOption = {
  provider: RouteProvider;
  providerRouteId: string;
  summary: string;
  durationMinutes: number;
  departureTime: string;
  arrivalTime: string;
};

export type GoogleRouteFixture = {
  routes: Array<{
    id: string;
    summary: string;
    durationMinutes: number;
    departureTime: string;
    arrivalTime: string;
  }>;
};
