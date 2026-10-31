import { describe, it, expect } from "vitest";
import { AuditLog } from "../index.js";

describe("Audit Chain Validation", () => {
  it("records critical lifecycle actions", () => {
    const audit = new AuditLog();

    const events = [
      {
        actorId: "user-1",
        entityType: "user",
        entityId: "user-1",
        action: "login",
        status: "success" as const,
      },
      {
        actorId: "user-1",
        entityType: "product",
        entityId: "product-1",
        action: "publish",
        status: "success" as const,
      },
      {
        actorId: "user-1",
        entityType: "product",
        entityId: "product-1",
        action: "install",
        status: "success" as const,
      },
      {
        actorId: "user-1",
        entityType: "world",
        entityId: "world-1",
        action: "launch",
        status: "success" as const,
      },
      {
        actorId: "user-1",
        entityType: "agent",
        entityId: "guide-agent",
        action: "agent_execute",
        status: "success" as const,
      },
    ];

    for (const event of events) {
      audit.append(event);
    }

    const auditEvents = audit.query();

    expect(auditEvents.length).toBeGreaterThan(0);
    expect(auditEvents).toContainEqual(
      expect.objectContaining({
        action: "publish",
        entityType: "product",
        status: "success",
      }),
    );

    expect(auditEvents).toContainEqual(
      expect.objectContaining({
        action: "install",
        entityType: "product",
      }),
    );

    expect(auditEvents).toContainEqual(
      expect.objectContaining({
        action: "launch",
        entityType: "world",
      }),
    );

    expect(auditEvents).toContainEqual(
      expect.objectContaining({
        action: "agent_execute",
        entityType: "agent",
      }),
    );
  });
});
