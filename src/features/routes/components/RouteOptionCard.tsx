import React from "react";
import type { RouteOption } from "../types";

type RouteOptionCardProps = {
  route: RouteOption;
  isSelected: boolean;
  onSelect: (routeId: string) => void;
};

export function RouteOptionCard({ route, isSelected, onSelect }: RouteOptionCardProps) {
  return (
    <article aria-current={isSelected ? "true" : undefined}>
      <h3>{route.summary}</h3>
      <p>{route.durationMinutes} min</p>
      <p>
        {route.departureTime} - {route.arrivalTime}
      </p>
      <button type="button" onClick={() => onSelect(route.providerRouteId)}>
        {isSelected ? "Viewing details" : `View details for ${route.summary}`}
      </button>
    </article>
  );
}
