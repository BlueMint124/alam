import React from "react";
import type { AlertPresentationState } from "../../presentation/types";
import type { AlertOverlayState } from "../../../app/store/appStore";

type ArrivalAlertModalProps = {
  overlay: AlertOverlayState;
  presentationState: AlertPresentationState;
  onConfirm: () => void;
};

export function ArrivalAlertModal({
  overlay,
  presentationState,
  onConfirm,
}: ArrivalAlertModalProps) {
  if (!overlay.isOpen) {
    return null;
  }

  return (
    <div
      className="alert-scrim"
      role="dialog"
      aria-modal="true"
      aria-label={overlay.title}
      data-testid="alert-modal"
      data-state={presentationState}
    >
      <section className="alert-modal">
        <div className="alert-modal__icon" aria-hidden="true">
          알림
        </div>
        <p className="alert-modal__eyebrow">하차 알림</p>
        <h2 className="alert-modal__title">{overlay.title}</h2>
        <p className="alert-modal__description">{overlay.description}</p>
        <div className="alert-modal__meta">
          <span>{overlay.routeLabel}</span>
          <span>{overlay.etaLabel}</span>
        </div>
        <button type="button" className="primary-button" onClick={onConfirm}>
          확인
        </button>
      </section>
    </div>
  );
}
