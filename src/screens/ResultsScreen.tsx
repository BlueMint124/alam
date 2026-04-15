import React from "react";
import { clearSelectedRoute, selectRoute, startBoarding, useAppStore } from "../app/store/appStore";
import { RouteDetailCard } from "../features/routes/components/RouteDetailCard";
import { RouteOptionCard } from "../features/routes/components/RouteOptionCard";
import type { RouteOption } from "../features/routes/types";

type ResultsScreenProps = {
  routes: RouteOption[];
};

export function ResultsScreen({ routes }: ResultsScreenProps) {
  const selectedRouteId = useAppStore((state) => state.selectedRouteId);
  const boardingRouteId = useAppStore((state) => state.boardingRouteId);

  const selectedRoute = routes.find((route) => route.providerRouteId === selectedRouteId) ?? null;

  React.useEffect(() => {
    if (routes.length === 0) {
      clearSelectedRoute();
      return;
    }

    if (selectedRouteId && !selectedRoute) {
      clearSelectedRoute();
    }
  }, [routes, selectedRoute, selectedRouteId]);

  return (
    <section aria-label="Route results">
      <h2>Route results</h2>
      {routes.length === 0 ? (
        <p>No routes yet.</p>
      ) : (
        <div>
          <div>
            {routes.map((route) => (
              <RouteOptionCard
                key={route.providerRouteId}
                route={route}
                isSelected={route.providerRouteId === selectedRouteId}
                onSelect={selectRoute}
              />
            ))}
          </div>
          {selectedRoute ? (
            <RouteDetailCard
              route={selectedRoute}
              boardingStarted={boardingRouteId === selectedRoute.providerRouteId}
              onBoardingStart={() => startBoarding(selectedRoute.providerRouteId)}
            />
          ) : (
            <p>Select a route to view details.</p>
          )}
        </div>
      )}
    </section>
  );
}
