import React from "react";
import type { RouteOption, RouteSegment } from "../types";
import { LocalStorageGateway } from "../../storage/LocalStorageGateway";
import { toStoredRoute } from "../../storage/StorageGateway";

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
  const [favoriteSaved, setFavoriteSaved] = React.useState(false);
  const storageGateway = React.useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return new LocalStorageGateway(window.localStorage);
  }, []);

  const handleFavoriteSave = () => {
    if (!storageGateway) {
      return;
    }

    storageGateway.saveFavorite(toStoredRoute(route));
    setFavoriteSaved(true);
  };

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
      <div>
        <button type="button" onClick={handleFavoriteSave}>
          Save Favorite
        </button>
        <button type="button" onClick={onBoardingStart}>
          Boarding Start
        </button>
      </div>
      {favoriteSaved ? <p>Saved to favorites.</p> : null}
      {boardingStarted ? <p>Boarding started for this route.</p> : null}
    </aside>
  );
}
