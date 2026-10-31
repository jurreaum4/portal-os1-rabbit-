import { describe, it, expect, vi } from "vitest";
import {
  AgentRuntime,
  Product,
  ProductRegistry,
  MarketplaceSearch,
  RecommendationEngine,
  InstallProduct,
  WorldRuntime,
  type AgentContext,
} from "../index.js";

describe("marketplace runtime", () => {
  it("validates, searches, and recommends products", () => {
    const registry = new ProductRegistry();
    const builder = Product.create({
      id: "product-builder",
      name: "Portal Builder",
      ownerId: "user-1",
      description: "Build worlds and publish portal assets.",
      status: "published",
    });
    const gear = Product.create({
      id: "product-gear",
      name: "Inventory Gear",
      ownerId: "user-2",
      description: "Cosmetic inventory items.",
      status: "published",
    });

    registry.register(builder);
    registry.register(gear);

    expect(registry.search("builder")).toHaveLength(1);
    expect(new MarketplaceSearch(registry).search("portal")[0]?.name).toBe("Portal Builder");
    expect(RecommendationEngine.recommend([gear, builder])[0]?.id).toBe("product-builder");
    expect(() => InstallProduct.run(gear, "", "library-1")).toThrow("User id is required");
  });

  it("installs only published products and keeps the install record consistent", () => {
    const product = Product.create({
      id: "product-install",
      name: "Launch Pack",
      ownerId: "owner-1",
      description: "Launch assets for new content.",
      status: "published",
    });

    expect(InstallProduct.run(product, "user-1", "library-1")).toMatchObject({
      productId: "product-install",
      userId: "user-1",
      libraryId: "library-1",
      status: "installed",
    });

    expect(() => InstallProduct.run(Product.create({
      id: "draft-product",
      name: "Draft Pack",
      ownerId: "owner-1",
      description: "draft",
      status: "draft",
    }), "user-1", "library-1")).toThrow("Only published products can be installed");
  });
});

describe("world runtime", () => {
  it("tracks boot, district transitions, player spawn and launch state", () => {
    const runtime = new WorldRuntime();
    expect(runtime.boot()).toMatchObject({ booted: true, sceneLoaded: true, nexusReady: true });
    expect(runtime.spawnPlayer()).toMatchObject({ spawnPoint: "nexus" });
    expect(runtime.loadDistrict("district-alpha")).toEqual({ district: "district-alpha", loaded: true });
    expect(runtime.teleport("district-alpha", "district-beta")).toEqual({
      from: "district-alpha",
      to: "district-beta",
      success: true,
    });
    expect(runtime.launchContent("content-42")).toEqual({ contentId: "content-42", launched: true });
    expect(runtime.updateHud("Portal Ready")).toEqual({ label: "Portal Ready", visible: true });
    expect(runtime.returnPortal()).toEqual({ destination: "portal", success: true });
  });
});

describe("agent runtime", () => {
  it("enforces permissions, tracks audit and telemetry", () => {
    const runtime = new AgentRuntime();
    const context: AgentContext = {
      command: "guide",
      userId: "user-1",
      payload: { target: "portal" },
    };

    expect(runtime.execute(context)).toMatchObject({ ok: true, command: "guide", userId: "user-1" });
    expect(runtime.auditAction(context, "success")).toMatchObject({
      userId: "user-1",
      command: "guide",
      status: "success",
    });
    expect(runtime.generateTelemetry(context)).toMatchObject({
      command: "guide",
      userId: "user-1",
    });
    expect(() => runtime.execute({ command: "guide", userId: "" })).toThrow("Permission denied");
  });

  it("binds commands to a registry when available", () => {
    const runtime = new AgentRuntime();
    runtime["registry"].register("guide-agent", ["guide", "ask", "recommend"] as const);
    expect(runtime.evaluatePermission("user-1", "guide")).toBe(true);
    expect(runtime.evaluatePermission("user-1", "build")).toBe(false);
  });
});
