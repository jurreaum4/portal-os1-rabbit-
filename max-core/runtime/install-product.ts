import type { Product } from "./product.js";
import { ProductValidation } from "./product-registry.js";

export class InstallProduct {
  static run(product: Product, userId: string, libraryId: string): Record<string, unknown> {
    if (!userId.trim()) {
      throw new Error("User id is required");
    }
    if (!libraryId.trim()) {
      throw new Error("Library id is required");
    }

    const issues = ProductValidation.run(product);
    if (issues.length > 0) {
      throw new Error(`Product validation failed: ${issues.join(", ")}`);
    }
    if (product.status !== "published") {
      throw new Error("Only published products can be installed");
    }

    return {
      productId: product.id,
      userId,
      libraryId,
      installedAt: new Date().toISOString(),
      status: "installed",
    };
  }

  static validateOwner(product: Product, userId: string): boolean {
    return !!userId.trim() && product.ownerId === userId.trim();
  }
}

export class UninstallProduct {
  static run(productId: string): { productId: string; status: "removed" } {
    if (!productId.trim()) {
      throw new Error("Product id is required");
    }
    return { productId, status: "removed" };
  }
}

export class UpgradeProduct {
  static run(productId: string, versionNumber: number): {
    productId: string;
    versionNumber: number;
    status: "upgraded";
    upgradedAt: string;
  } {
    if (!productId.trim()) {
      throw new Error("Product id is required");
    }
    if (!Number.isFinite(versionNumber) || versionNumber <= 0) {
      throw new Error("Version number must be a positive integer");
    }

    return {
      productId,
      versionNumber,
      status: "upgraded",
      upgradedAt: new Date().toISOString(),
    };
  }
}
