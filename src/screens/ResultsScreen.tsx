import React from "react";
import type { RouteOption } from "../features/routes/types";
import { RouteOptionCard } from "../features/routes/components/RouteOptionCard";

type ResultsScreenProps = {
  routes: RouteOption[];
};

export function ResultsScreen({ routes }: ResultsScreenProps) {
  return (
    <section aria-label="Route results">
      <h2>Route results</h2>
      {routes.length === 0 ? (
        <p>No routes yet.</p>
      ) : (
        <div>
          {routes.map((route) => (
            <RouteOptionCard key={route.providerRouteId} route={route} />
          ))}
        </div>
      )}
    </section>
  );
}
