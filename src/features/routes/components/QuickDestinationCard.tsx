import React from "react";

type QuickDestinationCardProps = {
  label: string;
  meta: string;
  tone: "lavender" | "mint";
  onSelect: () => void;
};

export function QuickDestinationCard({ label, meta, tone, onSelect }: QuickDestinationCardProps) {
  return (
    <button
      type="button"
      className={`quick-destination-card quick-destination-card--${tone}`}
      onClick={onSelect}
    >
      <span className="quick-destination-card__label">{label}</span>
      <span className="quick-destination-card__meta">{meta}</span>
    </button>
  );
}
