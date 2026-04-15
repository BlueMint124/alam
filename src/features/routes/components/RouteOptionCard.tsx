import React from "react";
import type { RouteOption } from "../types";

type RouteOptionCardProps = {
  route: RouteOption;
};

export function RouteOptionCard({ route }: RouteOptionCardProps) {
  return (
    <article>
      <h3>{route.summary}</h3>
      <p>{route.durationMinutes} min</p>
      <p>
        {route.departureTime} - {route.arrivalTime}
      </p>
    </article>
  );
}
