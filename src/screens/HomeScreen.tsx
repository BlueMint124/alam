import React from "react";
import { searchTransitRoutes } from "../features/routes/api/searchTransitRoutes";
import type { RouteOption } from "../features/routes/types";
import { RouteSearchForm } from "../features/routes/components/RouteSearchForm";
import { ResultsScreen } from "./ResultsScreen";

export function HomeScreen() {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [routes, setRoutes] = React.useState<RouteOption[]>([]);

  const handleSearch = async () => {
    setIsSearching(true);

    try {
      const nextRoutes = await searchTransitRoutes({ from, to });
      setRoutes(nextRoutes);
    } catch {
      // Route error handling will be added later.
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section>
      <h2>Find your next route</h2>
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
