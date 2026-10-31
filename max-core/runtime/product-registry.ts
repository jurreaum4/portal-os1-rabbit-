import type { Product } from "./product.js";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function scoreProduct(product: Product, term: string): number {
  const haystack = normalize(`${product.name} ${product.description}`);
  const normalizedTerm = normalize(term);

  if (!normalizedTerm) return 0;
  if (haystack.includes(normalizedTerm)) return 100;

  let score = 0;
  for (const part of normalizedTerm.split(/\s+/).filter(Boolean)) {
    if (product.name.toLowerCase().includes(part)) score += 20;
    if (product.description.toLowerCase().includes(part)) score += 10;
  }

  return score;
}

export type MarketplaceSearchResult = {
  productId: string;
  name: string;
  score: number;
};

export class ProductRegistry {
  private readonly products = new Map<string, Product>();

  register(product: Product): Product {
    if (!product.name.trim()) throw new Error("Product name is required");
    if (!product.ownerId.trim()) throw new Error("Product owner is required");
    this.products.set(product.id, product);
    return product;
  }

  get(id: string): Product | undefined {
    return this.products.get(id);
  }

  list(): Product[] {
    return [...this.products.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  search(term: string): Product[] {
    const normalizedTerm = normalize(term);
    const products = this.list();

    if (!normalizedTerm) {
      return products;
    }

    const tokens = normalizedTerm.split(/\s+/).filter(Boolean);
    return products
      .filter((product) => {
        const haystack = normalize(`${product.name} ${product.description}`);
        return tokens.every((token) => haystack.includes(token));
      })
      .sort((a, b) => scoreProduct(b, normalizedTerm) - scoreProduct(a, normalizedTerm));
  }
}

export class ProductValidation {
  static run(product: Product): string[] {
    const issues: string[] = [];
    if (!product.id.trim()) issues.push("Product id is required");
    if (!product.name.trim()) issues.push("Product name is required");
    if (!product.ownerId.trim()) issues.push("Product owner is required");
    if (product.status === "published" && !product.description.trim()) {
      issues.push("Published products require a description");
    }
    return issues;
  }
}

export class MarketplaceSearch {
  constructor(private readonly registry: ProductRegistry) {}

  search(term: string): MarketplaceSearchResult[] {
    return this.registry
      .search(term)
      .map((product) => ({
        productId: product.id,
        name: product.name,
        score: scoreProduct(product, term),
      }))
      .sort((a, b) => b.score - a.score);
  }
}

export class RecommendationEngine {
  static recommend(products: Product[]): Product[] {
    return [...products]
      .sort((a, b) => {
        const aWeight = a.status === "published" ? 1 : 0;
        const bWeight = b.status === "published" ? 1 : 0;
        return bWeight - aWeight || a.name.localeCompare(b.name);
      })
      .slice(0, 5);
  }
}
