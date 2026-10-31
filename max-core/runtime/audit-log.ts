export type AuditEvent = {
  id: string;
  actorId: string;
  entityType: string;
  entityId: string;
  action: string;
  status: "success" | "denied" | "failed";
  createdAt: string;
  metadata?: Record<string, unknown>;
};

export class AuditLog {
  private readonly entries: AuditEvent[] = [];

  append(event: Omit<AuditEvent, "id" | "createdAt">): AuditEvent {
    const next: AuditEvent = {
      ...event,
      id: `audit-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    };
    this.entries.push(next);
    return next;
  }

  query(entityType?: string, entityId?: string): AuditEvent[] {
    return this.entries.filter((entry) => {
      if (entityType && entry.entityType !== entityType) return false;
      if (entityId && entry.entityId !== entityId) return false;
      return true;
    });
  }
}
