import { describe, it, expect } from "vitest";
import { ProviderStateRuntime } from "../index.js";

describe("Provider States", () => {
  it("handles connected provider", () => {
    const result = ProviderStateRuntime.evaluate("CONNECTED");
    expect(result.state).toBe("CONNECTED");
    expect(result.auditEvent).toBe("provider.connected");
    expect(result.telemetry).toMatchObject({ connected: true });
  });

  it("handles degraded provider", () => {
    const result = ProviderStateRuntime.evaluate("DEGRADED");
    expect(result.state).toBe("DEGRADED");
    expect(result.userFeedback).toContain("limited");
    expect(result.telemetry).toMatchObject({ degraded: true });
  });

  it("handles stale cache and refresh path", () => {
    const result = ProviderStateRuntime.evaluate("STALE");
    expect(result.state).toBe("STALE");
    expect(result.recovery).toContain("Refresh");
    expect(result.auditEvent).toBe("provider.stale");
  });

  it("handles blocked governance action", () => {
    const result = ProviderStateRuntime.evaluate("BLOCKED");
    expect(result.state).toBe("BLOCKED");
    expect(result.userFeedback).toContain("blocked");
    expect(result.auditEvent).toBe("provider.blocked");
  });

  it("handles disconnected registry", () => {
    const result = ProviderStateRuntime.evaluate("DISCONNECTED");
    expect(result.state).toBe("DISCONNECTED");
    expect(result.recovery).toContain("Reconnect");
    expect(result.telemetry).toMatchObject({ disconnected: true });
  });

  it("handles unconfigured provider", () => {
    const result = ProviderStateRuntime.evaluate("UNCONFIGURED");
    expect(result.state).toBe("UNCONFIGURED");
    expect(result.userFeedback).toContain("Missing");
    expect(result.auditEvent).toBe("provider.unconfigured");
  });
});
