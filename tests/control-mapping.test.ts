import { describe, expect, it } from "vitest";
import { mapControlsToEvidence } from "@/lib/controls/mapping";
import { demoAnswers, demoFindings } from "@/lib/fixtures/demo-data";

describe("mapControlsToEvidence", () => {
  it("maps failed cloud findings to related controls", () => {
    const controls = mapControlsToEvidence(demoFindings, demoAnswers);
    const cloudExposure = controls.find((control) => control.id === "CLD-001");
    expect(cloudExposure?.relatedFindings.length).toBeGreaterThan(0);
    expect(cloudExposure?.status).toBe("partial");
  });
});
