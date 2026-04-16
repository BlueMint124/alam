import React from "react";
import { resetAppStore } from "../app/store/appStore";
import { searchTransitRoutes } from "../features/routes/api/searchTransitRoutes";
import type { RouteOption } from "../features/routes/types";
import { RouteSearchForm } from "../features/routes/components/RouteSearchForm";
import { ResultsScreen } from "./ResultsScreen";
import { LocalStorageGateway, type StoredRoute } from "../features/storage/LocalStorageGateway";
import { toStoredRoute } from "../features/storage/StorageGateway";

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
    <section>
      <h2>Find your next route</h2>
      {recentRoutes.length > 0 ? (
        <section aria-label="Recent routes">
          <h3>Recent routes</h3>
          <ul>
            {recentRoutes.map((route) => (
              <li key={`${route.providerRouteId}-${route.savedAt}`}>{route.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
      <RouteSearchForm
        from={from}
        to={to}
        isSearching={isSearching}
        onFromChange={setFrom}
        onToChange={setTo}
        onSubmit={handleSearch}
      />
      {isSearching ? <p>Searching routes...</p> : <ResultsScreen routes={routes} />}
    </section>
  );
}
