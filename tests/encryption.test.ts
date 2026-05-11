import { describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret, secretPreview } from "@/lib/crypto/encryption";

describe("encryption helper", () => {
  it("round-trips encrypted secrets", () => {
    const encrypted = encryptSecret("super-secret-value");
    expect(encrypted).not.toContain("super-secret-value");
    expect(decryptSecret(encrypted)).toBe("super-secret-value");
  });

  it("creates a non-sensitive preview", () => {
    expect(secretPreview("abcdef123456")).toBe("abc...3456");
  });
});
