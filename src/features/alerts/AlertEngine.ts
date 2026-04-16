export type AlertKind = "TRANSFER" | "FINAL";

export type AlertRuleSet = {
  transferEnabled: boolean;
  finalEnabled: boolean;
};

export type AlertEvaluationState = {
  remainingStops: number;
  transferThreshold: number;
  finalThreshold: number;
  emittedAlerts: AlertKind[];
};

export type AlertResult = {
  kind: AlertKind;
};

export class AlertEngine {
  constructor(private readonly rules: AlertRuleSet) {}

  evaluate(state: AlertEvaluationState): AlertResult[] {
    const alerts: AlertResult[] = [];

    if (
      this.rules.transferEnabled &&
      state.remainingStops === state.transferThreshold &&
      !state.emittedAlerts.includes("TRANSFER")
    ) {
      alerts.push({ kind: "TRANSFER" });
    }

    if (
      this.rules.finalEnabled &&
      state.remainingStops === state.finalThreshold &&
      !state.emittedAlerts.includes("FINAL")
    ) {
      alerts.push({ kind: "FINAL" });
    }

    return alerts;
  }
}
