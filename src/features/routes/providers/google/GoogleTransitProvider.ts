import googleRouteFixture from "./googleRoute.fixture.json";
import { normalizeGoogleRoute } from "../../normalizers/normalizeGoogleRoute";
import type { GoogleRouteFixture, RouteOption } from "../../types";
import type { TransitSearchCriteria } from "../../api/searchTransitRoutes";

async function searchRoutes(_criteria: TransitSearchCriteria): Promise<RouteOption[]> {
  await Promise.resolve();
  return normalizeGoogleRoute(googleRouteFixture as GoogleRouteFixture);
}

export const googleTransitProvider = {
  searchRoutes,
};
