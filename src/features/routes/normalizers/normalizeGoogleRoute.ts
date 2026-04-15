import type { GoogleRouteFixture, RouteOption } from "../types";

export function normalizeGoogleRoute(fixture: GoogleRouteFixture): RouteOption[] {
  return fixture.routes.map((route) => ({
    provider: "google",
    providerRouteId: route.id,
    summary: route.summary,
    durationMinutes: route.durationMinutes,
    departureTime: route.departureTime,
    arrivalTime: route.arrivalTime,
  }));
}
