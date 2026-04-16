import type { RouteOption } from "../routes/types";

export type StoredRoute = {
  providerRouteId: string;
  summary: string;
  savedAt: string;
};

export interface StorageGateway {
  saveRecent(route: StoredRoute): void;
  getRecents(): StoredRoute[];
  saveFavorite(route: StoredRoute): void;
  getFavorites(): StoredRoute[];
}

export function toStoredRoute(
  route: Pick<RouteOption, "providerRouteId" | "summary">,
  savedAt = new Date().toISOString(),
): StoredRoute {
  return {
    providerRouteId: route.providerRouteId,
    summary: route.summary,
    savedAt,
  };
}
