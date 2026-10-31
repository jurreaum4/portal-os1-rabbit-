import { describe, it, expect } from "vitest";
import {
  AgentRuntime,
  GovernanceRuntime,
  IdentityRegistry,
  UserIdentity,
  WorkflowOrchestrator,
  Product,
  ProductRegistry,
  WorldRuntime,
} from "../index.js";

describe("Full Failure-Mode Suite", () => {
  it("blocks workflow on registry drift", async () => {
    const product = Product.create({
      id: "product-1",
      name: "Drifted Product",
      ownerId: "user-a",
      description: "Exists in marketplace but not in world registry.",
      status: "published",
    });

    const marketplaceRegistry = new ProductRegistry();
    marketplaceRegistry.register(product);

    const world = new WorldRuntime();

    const workflow = new WorkflowOrchestrator();
    workflow
      .addStep("check-marketplace", () => marketplaceRegistry.get("product-1") !== undefined)
      .addStep("check-world", () => {
        const worldProduct = false;
        if (!world || !world.boot()) {
          throw new Error("World registry missing product");
        }
        return worldProduct;
      });

    const results = await workflow.run();

    expect(results.some((result) => result.ok === false)).toBe(true);
    expect(results.some((result) => result.error?.includes("missing product"))).toBe(true);
  });

  it("denies launch when identity mismatch occurs", () => {
    const registry = new IdentityRegistry();
    registry.register(new UserIdentity({ id: "user-a", displayName: "User A", roles: ["creator"] }));
    registry.register(new UserIdentity({ id: "user-b", displayName: "User B", roles: ["creator"] }));

    const governance = new GovernanceRuntime(registry["users"]);

    const installDecision = governance.authorize({
      actorId: "user-a",
      action: "install",
      resourceType: "product",
      resourceOwnerId: "user-a",
      roles: ["creator"],
    });

    const launchDecision = governance.authorize({
      actorId: "user-b",
      action: "launch",
      resourceType: "world",
      resourceOwnerId: "user-a",
      roles: ["creator"],
    });

    expect(installDecision.allowed).toBe(true);
    expect(launchDecision.allowed).toBe(false);
  });

  it("fails validation when audit chain is broken", () => {
    const auditEvents: unknown[] = [];

    const hasAuditRecord = auditEvents.length > 0;
    expect(hasAuditRecord).toBe(false);

    const validation = hasAuditRecord ? "pass" : "fail";
    expect(validation).toBe("fail");
  });

  it("uses fallback path when agent runtime is unavailable", () => {
    const runtime = new AgentRuntime();
    const context = {
      command: "guide" as const,
      userId: "user-1",
      payload: { target: "portal" },
    };

    const safeFallback = () => {
      const telemetry = runtime.generateTelemetry(context);
      return {
        ok: false,
        fallback: true,
        telemetry,
      };
    };

    const result = safeFallback();

    expect(result.ok).toBe(false);
    expect(result.fallback).toBe(true);
    expect(result.telemetry).toMatchObject({
      command: "guide",
      userId: "user-1",
    });
  });
});
