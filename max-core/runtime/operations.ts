export type OperationsState = "healthy" | "degraded" | "blocked";

export interface ServiceHealthSnapshot {
  service: string;
  status: OperationsState;
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export class OperationsRuntime {
  private readonly snapshots = new Map<string, ServiceHealthSnapshot>();

  report(service: string, status: OperationsState, message: string, metadata?: Record<string, unknown>): ServiceHealthSnapshot {
    const snapshot: ServiceHealthSnapshot = {
      service: service.trim(),
      status,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      metadata,
    };

    if (!snapshot.service) {
      throw new Error("Service name is required");
    }

    this.snapshots.set(snapshot.service, snapshot);
    return snapshot;
  }

  get(service: string): ServiceHealthSnapshot | undefined {
    return this.snapshots.get(service.trim());
  }

  list(): ServiceHealthSnapshot[] {
    return [...this.snapshots.values()];
  }

  summary(): { healthy: number; degraded: number; blocked: number } {
    const summary = { healthy: 0, degraded: 0, blocked: 0 };
    for (const snapshot of this.snapshots.values()) {
      if (snapshot.status === "healthy") summary.healthy += 1;
      else if (snapshot.status === "degraded") summary.degraded += 1;
      else summary.blocked += 1;
    }
    return summary;
  }
}
