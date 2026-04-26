import type { RouteOption } from "../types";
import { googleTransitProvider } from "../providers/google/GoogleTransitProvider";

export type TransitSearchCriteria = {
  from: string;
  to: string;
};

export async function searchTransitRoutes(criteria: TransitSearchCriteria): Promise<RouteOption[]> {
  return googleTransitProvider.searchRoutes(criteria);
}
