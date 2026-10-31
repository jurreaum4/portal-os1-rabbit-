import type { Product } from "./product.js";

export type MarketplaceSearchResult = {
  productId: string;
  name: string;
  score: number;
};

export class ProductRegistry {
  private readonly products = new Map<string, Product>();

  register(product: Product): Product {
    this.products.set(product.id, product);
    return product;
  }

  get(id: string): Product | undefined {
    return this.products.get(id);
  }

  search(term: string): Product[] {
    const q = term.trim().toLowerCase();
    if (!q) return [...this.products.values()];
    return [...this.products.values()].filter((product) =>
      product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q),
    );
  }
}

export class ProductValidation {
  static run(product: Product): string[] {
    const issues: string[] = [];
    if (!product.name.trim()) issues.push("Product name is required");
    if (!product.ownerId.trim()) issues.push("Product owner is required");
    return issues;
  }
}

export class MarketplaceSearch {
  constructor(private readonly registry: ProductRegistry) {}

  search(term: string): MarketplaceSearchResult[] {
    return this.registry.search(term).map((product) => ({
      productId: product.id,
      name: product.name,
      score: product.name.toLowerCase().includes(term.toLowerCase()) ? 1 : 0.5,
    }));
  }
}

export class RecommendationEngine {
  static recommend(products: Product[]): Product[] {
    return products.slice(0, 5);
  }
}
