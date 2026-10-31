import { describe, it, expect } from "vitest";
import {
  AgentRuntime,
  GovernanceRuntime,
  IdentityRegistry,
  InstallProduct,
  Product,
  ProductRegistry,
  UserIdentity,
  WorkflowOrchestrator,
  WorldRuntime,
} from "../index.js";

describe("MAXVERSE end-to-end acceptance", () => {
  it("supports login -> create -> publish -> marketplace -> install -> library -> world -> launch -> ai", async () => {
    const identityRegistry = new IdentityRegistry();
    const creator = new UserIdentity({
      id: "user-creator-1",
      displayName: "Creator One",
      email: "creator@example.com",
      roles: ["owner", "creator", "admin"],
    });

    identityRegistry.register(creator);

    const governance = new GovernanceRuntime(identityRegistry["users"]);

    const user = identityRegistry.require("user-creator-1");
    expect(user.hasRole("creator")).toBe(true);

    const approval = governance.authorize({
      actorId: "user-creator-1",
      action: "publish",
      resourceType: "product",
      resourceOwnerId: "user-creator-1",
      roles: ["owner", "creator", "admin"],
    });

    expect(approval.allowed).toBe(true);

    const product = Product.create({
      id: "product-portal-01",
      name: "Portal Library Pack",
      ownerId: "user-creator-1",
      description: "A curated portal world pack for MAXVERSE.",
      status: "published",
    });

    const registry = new ProductRegistry();
    registry.register(product);

    const searchResults = registry.search("portal");
    expect(searchResults.some((entry) => entry.id === "product-portal-01")).toBe(true);

    const installResult = InstallProduct.run(product, "user-creator-1", "library-portal");
    expect(installResult).toMatchObject({
      productId: "product-portal-01",
      userId: "user-creator-1",
      libraryId: "library-portal",
      status: "installed",
    });

    const world = new WorldRuntime();
    expect(world.boot()).toMatchObject({
      booted: true,
      sceneLoaded: true,
      nexusReady: true,
    });

    const player = world.spawnPlayer();
    expect(player.spawnPoint).toBe("nexus");

    expect(world.loadDistrict("nexus")).toEqual({
      district: "nexus",
      loaded: true,
    });

    expect(world.teleport("nexus", "district-alpha")).toEqual({
      from: "nexus",
      to: "district-alpha",
      success: true,
    });

    expect(world.launchContent("content-portal-01")).toEqual({
      contentId: "content-portal-01",
      launched: true,
    });

    expect(world.updateHud("Portal Ready")).toEqual({
      label: "Portal Ready",
      visible: true,
    });

    expect(world.returnPortal()).toEqual({
      destination: "portal",
      success: true,
    });

    const agentRuntime = new AgentRuntime();
    agentRuntime["registry"].register("guide-agent", ["guide", "ask", "recommend", "report"] as const);

    const aiResult = agentRuntime.execute({
      command: "guide",
      userId: "user-creator-1",
      payload: {
        target: "portal",
        action: "launch-content",
      },
    });

    expect(aiResult).toMatchObject({
      ok: true,
      command: "guide",
      userId: "user-creator-1",
    });

    const telemetry = agentRuntime.generateTelemetry({
      command: "guide",
      userId: "user-creator-1",
      payload: { target: "portal" },
    });

    expect(telemetry).toMatchObject({
      command: "guide",
      userId: "user-creator-1",
    });

    const workflow = new WorkflowOrchestrator();
    workflow
      .addStep("login", () => identityRegistry.require("user-creator-1"))
      .addStep("create", () => product)
      .addStep("publish", () => {
        const decision = governance.authorize({
          actorId: "user-creator-1",
          action: "publish",
          resourceType: "product",
          resourceOwnerId: "user-creator-1",
        });
        if (!decision.allowed) throw new Error("publish denied");
        return true;
      })
      .addStep("marketplace", () => registry.search("portal").length > 0)
      .addStep("install", () => InstallProduct.run(product, "user-creator-1", "library-portal"))
      .addStep("world", () => world.launchContent("content-portal-01"))
      .addStep("ai", () =>
        agentRuntime.execute({
          command: "guide",
          userId: "user-creator-1",
          payload: { target: "portal" },
        }),
      );

    const results = await workflow.run();

    expect(results.every((result) => result.ok)).toBe(true);
    expect(results.map((result) => result.step)).toEqual([
      "login",
      "create",
      "publish",
      "marketplace",
      "install",
      "world",
      "ai",
    ]);
  });
});
