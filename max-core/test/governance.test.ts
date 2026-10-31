import { describe, it, expect } from "vitest";
import { GovernanceRuntime, IdentityRegistry, UserIdentity } from "../index.js";

describe("Governance Validation", () => {
  it("blocks unauthorized publish", () => {
    const registry = new IdentityRegistry();
    registry.register(
      new UserIdentity({
        id: "user-a",
        displayName: "User A",
        roles: ["creator"],
      }),
    );

    const governance = new GovernanceRuntime(registry["users"]);

    const decision = governance.authorize({
      actorId: "user-a",
      action: "publish",
      resourceType: "product",
      resourceOwnerId: "user-b",
      roles: ["creator"],
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("Permission denied");
  });

  it("blocks unauthorized install", () => {
    const registry = new IdentityRegistry();
    registry.register(
      new UserIdentity({
        id: "user-a",
        displayName: "User A",
        roles: ["creator"],
      }),
    );

    const governance = new GovernanceRuntime(registry["users"]);

    const decision = governance.authorize({
      actorId: "user-a",
      action: "install",
      resourceType: "product",
      resourceOwnerId: "user-b",
      roles: ["creator"],
    });

    expect(decision.allowed).toBe(false);
  });

  it("blocks unauthorized agent use", () => {
    const registry = new IdentityRegistry();
    registry.register(
      new UserIdentity({
        id: "user-a",
        displayName: "User A",
        roles: ["creator"],
      }),
    );

    const governance = new GovernanceRuntime(registry["users"]);

    const decision = governance.authorize({
      actorId: "user-a",
      action: "ai",
      resourceType: "agent",
      resourceOwnerId: "user-b",
      roles: ["creator"],
    });

    expect(decision.allowed).toBe(false);
  });
});
