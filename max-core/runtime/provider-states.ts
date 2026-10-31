export type ProviderState =
  | "CONNECTED"
  | "DEGRADED"
  | "STALE"
  | "BLOCKED"
  | "DISCONNECTED"
  | "UNCONFIGURED";

export interface ProviderStateRecord {
  state: ProviderState;
  detection: string;
  recovery: string;
  userFeedback: string;
  auditEvent: string;
  telemetry: Record<string, unknown>;
}

export class ProviderStateRuntime {
  static evaluate(state: ProviderState): ProviderStateRecord {
    const map: Record<ProviderState, ProviderStateRecord> = {
      CONNECTED: {
        state: "CONNECTED",
        detection: "Provider connected and responsive",
        recovery: "Maintain active connection",
        userFeedback: "Service running normally",
        auditEvent: "provider.connected",
        telemetry: { connected: true },
      },
      DEGRADED: {
        state: "DEGRADED",
        detection: "Partial functionality detected",
        recovery: "Fallback to reduced mode",
        userFeedback: "Some features are limited",
        auditEvent: "provider.degraded",
        telemetry: { degraded: true },
      },
      STALE: {
        state: "STALE",
        detection: "Cached state is older than expected",
        recovery: "Refresh cache and revalidate",
        userFeedback: "Data is refreshing",
        auditEvent: "provider.stale",
        telemetry: { stale: true },
      },
      BLOCKED: {
        state: "BLOCKED",
        detection: "Policy or permission blocked the action",
        recovery: "Escalate or re-evaluate policy",
        userFeedback: "Action blocked by policy",
        auditEvent: "provider.blocked",
        telemetry: { blocked: true },
      },
      DISCONNECTED: {
        state: "DISCONNECTED",
        detection: "Offline or connection lost",
        recovery: "Reconnect and replay queued actions",
        userFeedback: "Connection lost; try again later",
        auditEvent: "provider.disconnected",
        telemetry: { disconnected: true },
      },
      UNCONFIGURED: {
        state: "UNCONFIGURED",
        detection: "Required configuration missing",
        recovery: "Load configuration before execution",
        userFeedback: "Missing configuration detected",
        auditEvent: "provider.unconfigured",
        telemetry: { unconfigured: true },
      },
    };
    return map[state];
  }
}
