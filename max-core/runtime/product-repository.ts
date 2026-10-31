import type { Product } from "./product.js";

export class ProductRepository {
  private readonly products = new Map<string, Product>();

  create(product: Product): Product {
    this.products.set(product.id, product);
    return product;
  }

  get(id: string): Product | undefined {
    return this.products.get(id);
  }

  listByOwner(ownerId: string): Product[] {
    return [...this.products.values()].filter((product) => product.ownerId === ownerId);
  }
}
