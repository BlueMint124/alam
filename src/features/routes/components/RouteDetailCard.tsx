import React from "react";
import type { RouteOption, RouteSegment } from "../types";

type RouteDetailCardProps = {
  route: RouteOption;
  boardingStarted?: boolean;
  onBoardingStart: () => void;
};

function renderSegmentMeta(segment: RouteSegment) {
  if (segment.kind !== "transit") {
    return null;
  }

  return (
    <>
      <p>{segment.lineName}</p>
      <p>
        {segment.stopCount} {segment.stopCount === 1 ? "stop" : "stops"}
      </p>
    </>
  );
}

export function RouteDetailCard({ route, boardingStarted = false, onBoardingStart }: RouteDetailCardProps) {
  return (
    <aside aria-label="Selected route details">
      <h3>{route.summary}</h3>
      <p>{route.durationMinutes} min</p>
      <p>
        {route.departureTime} - {route.arrivalTime}
      </p>
      <ul>
        {route.segments.map((segment) => (
          <li key={segment.id}>
            <p>{segment.instruction}</p>
            {renderSegmentMeta(segment)}
          </li>
        ))}
      </ul>
      <button type="button" onClick={onBoardingStart}>
        Boarding Start
      </button>
      {boardingStarted ? <p>Boarding started for this route.</p> : null}
    </aside>
  );
}
