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
      className="search-card"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="search-card__fieldGroup">
        <label className="field-label" htmlFor="route-from">
          출발지
        </label>
        <input
          id="route-from"
          className="search-input"
          name="from"
          type="text"
          placeholder="예: 명동역"
          value={from}
          onChange={(event) => onFromChange(event.target.value)}
        />
      </div>

      <div className="search-card__fieldGroup">
        <label className="field-label" htmlFor="route-to">
          도착지
        </label>
        <input
          id="route-to"
          className="search-input"
          name="to"
          type="text"
          placeholder="예: 서울역"
          value={to}
          onChange={(event) => onToChange(event.target.value)}
        />
      </div>

      <button className="primary-button" type="submit" disabled={isSearching}>
        {isSearching ? "경로를 찾는 중" : "길찾기"}
      </button>
    </form>
  );
}
