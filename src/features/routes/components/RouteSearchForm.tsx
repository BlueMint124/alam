import React from "react";

type RouteSearchFormProps = {
  from: string;
  to: string;
  isSearching?: boolean;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onSubmit: () => void;
};

export function RouteSearchForm({
  from,
  to,
  isSearching = false,
  onFromChange,
  onToChange,
  onSubmit,
}: RouteSearchFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="route-from">From</label>
      <input
        id="route-from"
        name="from"
        type="text"
        value={from}
        onChange={(event) => onFromChange(event.target.value)}
      />

      <label htmlFor="route-to">To</label>
      <input
        id="route-to"
        name="to"
        type="text"
        value={to}
        onChange={(event) => onToChange(event.target.value)}
      />

      <button type="submit" disabled={isSearching}>
        Find Routes
      </button>
    </form>
  );
}
