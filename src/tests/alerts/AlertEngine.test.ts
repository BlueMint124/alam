import { describe, expect, it } from "vitest";
import { AlertEngine, type AlertEvaluationState, type AlertRuleSet } from "../../features/alerts/AlertEngine";

const rules: AlertRuleSet = {
  transferEnabled: true,
  finalEnabled: true,
};

describe("AlertEngine", () => {
  it("fires one transfer alert and one final alert per session", () => {
    const engine = new AlertEngine(rules);

    const alerts = engine.evaluate({
      remainingStops: 2,
      transferThreshold: 2,
      finalThreshold: 2,
      emittedAlerts: [],
    } satisfies AlertEvaluationState);

    expect(alerts.map((item) => item.kind)).toEqual(["TRANSFER", "FINAL"]);
  });

  it("does not re-emit alerts that were already sent", () => {
    const engine = new AlertEngine(rules);

    const alerts = engine.evaluate({
      remainingStops: 2,
      transferThreshold: 2,
      finalThreshold: 2,
      emittedAlerts: ["TRANSFER", "FINAL"],
    } satisfies AlertEvaluationState);

    expect(alerts).toEqual([]);
  });

  it("respects disabled transfer alerts while still allowing final alerts", () => {
    const engine = new AlertEngine({
      transferEnabled: false,
      finalEnabled: true,
    });

    const alerts = engine.evaluate({
      remainingStops: 3,
      transferThreshold: 3,
      finalThreshold: 3,
      emittedAlerts: [],
    } satisfies AlertEvaluationState);

    expect(alerts.map((item) => item.kind)).toEqual(["FINAL"]);
  });
});
