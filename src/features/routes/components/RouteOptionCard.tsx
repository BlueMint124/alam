import React from "react";
import type { RouteOption, RouteTransitSegment } from "../types";

type RouteOptionCardProps = {
  route: RouteOption;
  isRecommended?: boolean;
  isSelected: boolean;
  onSelect: (routeId: string) => void;
};

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function formatTimeLabel(value: string) {
  return timeFormatter.format(new Date(value));
}

function formatStopLabel(segment: RouteTransitSegment) {
  if (segment.vehicleType === "subway") {
    return `${segment.stopCount}개 역`;
  }

  return `${segment.stopCount}정거장`;
}

function formatLineSummary(route: RouteOption) {
  const transitSegments = route.segments.filter((segment): segment is RouteTransitSegment => segment.kind === "transit");

  return transitSegments.map((segment) => `${segment.lineName} · ${formatStopLabel(segment)}`).join(" / ");
}

function getTransferCount(route: RouteOption) {
  const transitSegments = route.segments.filter((segment) => segment.kind === "transit");

  return Math.max(0, transitSegments.length - 1);
}

export function RouteOptionCard({ route, isRecommended = false, isSelected, onSelect }: RouteOptionCardProps) {
  const timeRangeLabel = `${formatTimeLabel(route.departureTime)} - ${formatTimeLabel(route.arrivalTime)}`;
  const transferCount = getTransferCount(route);
  const lineSummary = formatLineSummary(route);

  return (
    <article className={isSelected ? "route-card route-card--active" : "route-card"} aria-current={isSelected ? "true" : undefined}>
      <div className="route-card__meta">
        <div className="route-card__metaGroup">
          {isRecommended ? <span className="route-badge">추천 경로</span> : null}
          <span className="route-card__duration">{route.durationMinutes}분</span>
        </div>
        <span className="route-card__time">{timeRangeLabel}</span>
      </div>
      <h3 className="route-card__title">{route.summary}</h3>
      <p className="route-card__subcopy">환승 {transferCount}회</p>
      {lineSummary ? <p className="route-card__summary">{lineSummary}</p> : null}
      <button type="button" className="secondary-button" onClick={() => onSelect(route.providerRouteId)}>
        {isSelected ? "선택된 경로" : "이 경로 자세히 보기"}
      </button>
    </article>
  );
}
