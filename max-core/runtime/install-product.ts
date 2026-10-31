import type { Product } from "./product.js";
import { ProductValidation } from "./product-registry.js";

export class InstallProduct {
  static run(product: Product, userId: string, libraryId: string): Record<string, unknown> {
    const issues = ProductValidation.run(product);
    if (issues.length > 0) {
      throw new Error(`Product validation failed: ${issues.join(", ")}`);
    }
    return {
      productId: product.id,
      userId,
      libraryId,
      installedAt: new Date().toISOString(),
      status: "installed",
    };
  }
}

export class UninstallProduct {
  static run(productId: string): { productId: string; status: "removed" } {
    return { productId, status: "removed" };
  }
}

export class UpgradeProduct {
  static run(productId: string, versionNumber: number): { productId: string; versionNumber: number; status: "upgraded" } {
    return { productId, versionNumber, status: "upgraded" };
  }
}
