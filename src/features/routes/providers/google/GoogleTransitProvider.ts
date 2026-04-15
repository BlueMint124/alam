import googleRouteFixture from "./googleRoute.fixture.json";
import { normalizeGoogleRoute } from "../../normalizers/normalizeGoogleRoute";
import type { RouteOption } from "../../types";
import type { TransitSearchCriteria } from "../../api/searchTransitRoutes";

async function searchRoutes(_criteria: TransitSearchCriteria): Promise<RouteOption[]> {
  await Promise.resolve();
  return normalizeGoogleRoute(googleRouteFixture);
}

export const googleTransitProvider = {
  searchRoutes,
};
