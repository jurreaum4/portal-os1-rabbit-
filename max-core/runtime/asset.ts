export interface AssetInput {
  id?: string;
  projectId: string;
  name: string;
  type: string;
  path: string;
  dependsOn?: string[];
}

export class Asset {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly type: string;
  readonly path: string;
  readonly dependsOn: string[];

  constructor(input: AssetInput) {
    this.id = input.id ?? `asset-${crypto.randomUUID()}`;
    this.projectId = input.projectId;
    this.name = input.name;
    this.type = input.type;
    this.path = input.path;
    this.dependsOn = input.dependsOn ?? [];
  }
}

export class AssetManifest {
  readonly projectId: string;
  readonly assets: Asset[];

  constructor(projectId: string, assets: Asset[]) {
    this.projectId = projectId;
    this.assets = assets;
  }

  toJSON(): Record<string, unknown> {
    return {
      projectId: this.projectId,
      assets: this.assets.map((asset) => ({
        id: asset.id,
        name: asset.name,
        type: asset.type,
        path: asset.path,
        dependsOn: asset.dependsOn,
      })),
    };
  }
}

export class AssetRepository {
  private readonly assets = new Map<string, Asset>();

  register(input: AssetInput): Asset {
    const asset = new Asset(input);
    this.assets.set(asset.id, asset);
    return asset;
  }

  get(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  listForProject(projectId: string): Asset[] {
    return [...this.assets.values()].filter((asset) => asset.projectId === projectId);
  }

  dependencyGraph(projectId: string): Record<string, string[]> {
    return Object.fromEntries(
      this.listForProject(projectId).map((asset) => [asset.id, asset.dependsOn]),
    );
  }
}
