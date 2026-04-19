import React from "react";
import { resetAppStore } from "../app/store/appStore";
import { searchTransitRoutes } from "../features/routes/api/searchTransitRoutes";
import type { RouteOption } from "../features/routes/types";
import { RouteSearchForm } from "../features/routes/components/RouteSearchForm";
import { ResultsScreen } from "./ResultsScreen";
import { LocalStorageGateway, type StoredRoute } from "../features/storage/LocalStorageGateway";
import { toStoredRoute } from "../features/storage/StorageGateway";
import { QuickDestinationCard } from "../features/routes/components/QuickDestinationCard";

export function HomeScreen() {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [routes, setRoutes] = React.useState<RouteOption[]>([]);
  const [recentRoutes, setRecentRoutes] = React.useState<StoredRoute[]>([]);
  const storageGateway = React.useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return new LocalStorageGateway(window.localStorage);
  }, []);

  React.useEffect(() => {
    if (!storageGateway) {
      return;
    }

    setRecentRoutes(storageGateway.getRecents());
  }, [storageGateway]);

  const handleSearch = async () => {
    setIsSearching(true);
    resetAppStore();

    try {
      const nextRoutes = await searchTransitRoutes({ from, to });
      setRoutes(nextRoutes);

      if (storageGateway && nextRoutes[0]) {
        storageGateway.saveRecent(toStoredRoute(nextRoutes[0]));
        setRecentRoutes(storageGateway.getRecents());
      }
    } catch {
      setRoutes([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="screen screen--home">
      <div className="hero-card">
        <p className="hero-kicker">도착 알림</p>
        <h2 className="hero-title">지금 어디서 내려야 할지 놓치지 마세요</h2>
        <p className="hero-copy">대중교통 경로를 선택하면 하차 전과 환승 전에 알림을 보내드려요.</p>
      </div>

      <div className="quick-destination-grid" aria-label="빠른 목적지">
        <QuickDestinationCard label="집" meta="최근 저장됨" tone="lavender" onSelect={() => setTo("우리 집")} />
        <QuickDestinationCard label="학교" meta="오전 9시 도착" tone="mint" onSelect={() => setTo("학교")} />
      </div>

      <RouteSearchForm
        from={from}
        to={to}
        isSearching={isSearching}
        onFromChange={setFrom}
        onToChange={setTo}
        onSubmit={handleSearch}
      />

      {recentRoutes.length > 0 ? (
        <section aria-label="최근 경로" className="home-section">
          <div className="section-headingRow">
            <h3 className="section-heading">최근 경로</h3>
            <span className="section-headingMeta">최근 검색 기록</span>
          </div>
          <ul className="recent-route-list">
            {recentRoutes.map((route) => (
              <li className="recent-route-item" key={`${route.providerRouteId}-${route.savedAt}`}>
                {route.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {isSearching ? <p className="status-copy">경로를 찾는 중이에요.</p> : <ResultsScreen routes={routes} />}
    </section>
  );
}
