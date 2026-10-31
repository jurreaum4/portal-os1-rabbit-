export type ProjectStatus =
  | "draft"
  | "active"
  | "validated"
  | "published"
  | "archived";

export interface ProjectInput {
  id?: string;
  name: string;
  ownerId: string;
  description?: string;
  status?: ProjectStatus;
}

export class Version {
  readonly id: string;
  readonly projectId: string;
  readonly number: number;
  readonly createdAt: string;
  readonly notes: string;

  constructor(projectId: string, number: number, notes = "", createdAt = new Date().toISOString()) {
    this.id = `${projectId}-v${number}`;
    this.projectId = projectId;
    this.number = number;
    this.createdAt = createdAt;
    this.notes = notes;
  }
}

export class Project {
  readonly id: string;
  name: string;
  ownerId: string;
  description: string;
  status: ProjectStatus;
  readonly createdAt: string;
  updatedAt: string;
  readonly versions: Version[] = [];
  assetIds: string[] = [];
  manifest?: Record<string, unknown>;

  static create(input: ProjectInput): Project {
    return new Project(
      input.id ?? `project-${crypto.randomUUID()}`,
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
    status: ProjectStatus,
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

  saveDraft(): void {
    this.status = "draft";
    this.updatedAt = new Date().toISOString();
  }

  validate(): void {
    if (!this.name.trim()) {
      throw new Error("Project name cannot be empty");
    }
    if (this.name.trim().length < 2) {
      throw new Error("Project name must be at least 2 characters");
    }
    this.status = "validated";
    this.updatedAt = new Date().toISOString();
  }

  publish(): void {
    this.validate();
    this.status = "published";
    this.updatedAt = new Date().toISOString();
  }

  addVersion(version: Version): void {
    this.versions.push(version);
    this.updatedAt = new Date().toISOString();
  }
}
