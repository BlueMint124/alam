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
    <section aria-label="경로 추천" className="results-screen">
      <div className="section-headingRow results-screen__header">
        <div>
          <h2 className="section-heading">경로 추천</h2>
          <p className="results-screen__meta">도착 전 알림에 가장 적합한 대중교통 경로를 골라보세요.</p>
        </div>
      </div>
      {routes.length === 0 ? (
        <p className="status-copy">아직 추천된 경로가 없어요.</p>
      ) : (
        <div className="results-layout">
          <div className="results-stack">
            {routes.map((route, index) => (
              <RouteOptionCard
                key={route.providerRouteId}
                route={route}
                isRecommended={index === 0}
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
            <aside aria-label="선택한 경로 상세" className="detail-card detail-card--empty">
              <p className="detail-card__emptyCopy">상세를 보려면 경로를 선택하세요.</p>
            </aside>
          )}
        </div>
      )}
    </section>
  );
}
