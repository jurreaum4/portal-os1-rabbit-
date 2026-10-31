export type ProductStatus = "draft" | "published" | "archived";

export interface ProductInput {
  id?: string;
  name: string;
  ownerId: string;
  description?: string;
  status?: ProductStatus;
}

export class ProductVersion {
  readonly id: string;
  readonly productId: string;
  readonly number: number;
  readonly createdAt: string;
  readonly notes: string;

  constructor(productId: string, number: number, notes = "", createdAt = new Date().toISOString()) {
    this.id = `${productId}-product-v${number}`;
    this.productId = productId;
    this.number = number;
    this.createdAt = createdAt;
    this.notes = notes;
  }
}

export class Product {
  readonly id: string;
  name: string;
  ownerId: string;
  description: string;
  status: ProductStatus;
  readonly createdAt: string;
  updatedAt: string;
  readonly versions: ProductVersion[] = [];

  static create(input: ProductInput): Product {
    return new Product(
      input.id ?? `product-${crypto.randomUUID()}`,
      input.name,
      input.ownerId,
      input.description ?? "",
      input.status ?? "draft",
    );
  }

  constructor(
    id: string,
    name: string,
    ownerId: string,
    description: string,
    status: ProductStatus,
    createdAt = new Date().toISOString(),
  ) {
    this.id = id;
    this.name = name;
    this.ownerId = ownerId;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = createdAt;
  }

  publish(): void {
    this.status = "published";
    this.updatedAt = new Date().toISOString();
  }

  addVersion(version: ProductVersion): void {
    this.versions.push(version);
    this.updatedAt = new Date().toISOString();
  }
}
