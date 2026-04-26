import React from "react";
import type { RouteOption, RouteSegment, RouteTransitSegment } from "../types";
import { LocalStorageGateway } from "../../storage/LocalStorageGateway";
import { toStoredRoute } from "../../storage/StorageGateway";

type RouteDetailCardProps = {
  route: RouteOption;
  isExpanded: boolean;
  boardingStarted?: boolean;
  onBoardingStart: () => void;
};

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function formatTimeLabel(value: string) {
  return timeFormatter.format(new Date(value));
}

function formatTransitMeta(segment: RouteTransitSegment) {
  if (segment.vehicleType === "subway") {
    return `${segment.stopCount}개 역 이동`;
  }

  return `${segment.stopCount}정거장 이동`;
}

function renderSegmentMeta(segment: RouteSegment) {
  if (segment.kind !== "transit") {
    return <p className="segment-row__meta">도보 이동</p>;
  }

  return (
    <>
      <p className="segment-row__line">{segment.lineName}</p>
      <p className="segment-row__meta">{formatTransitMeta(segment)}</p>
    </>
  );
}

export function RouteDetailCard({
  route,
  isExpanded,
  boardingStarted = false,
  onBoardingStart,
}: RouteDetailCardProps) {
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
    <aside
      aria-label="선택한 경로 상세"
      className={isExpanded ? "detail-card detail-card--expanded" : "detail-card"}
      data-testid="route-detail-card"
      data-expanded={isExpanded ? "true" : "false"}
    >
      <div className="detail-card__header">
        <p className="detail-card__eyebrow">선택한 경로</p>
        <h3 className="detail-card__title">{route.summary}</h3>
        <p className="detail-card__duration">총 {route.durationMinutes}분</p>
        <p className="detail-card__time">
          {formatTimeLabel(route.departureTime)} 출발 ·{" "}
          {formatTimeLabel(route.arrivalTime)} 도착
        </p>
      </div>
      <ul className="segment-list">
        {route.segments.map((segment) => (
          <li key={segment.id} className="segment-row">
            <div className="segment-row__body">
              <p className="segment-row__instruction">{segment.instruction}</p>
              {renderSegmentMeta(segment)}
            </div>
          </li>
        ))}
      </ul>
      <div className="detail-card__actions">
        <button type="button" className="ghost-button" onClick={handleFavoriteSave}>
          즐겨찾기 저장
        </button>
        <button type="button" className="primary-button" onClick={onBoardingStart}>
          탑승 시작
        </button>
      </div>
      {favoriteSaved ? <p className="detail-card__feedback">즐겨찾기에 저장했어요.</p> : null}
      {boardingStarted ? <p className="detail-card__feedback">이 경로로 탑승을 시작했어요.</p> : null}
    </aside>
  );
}
