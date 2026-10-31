import type { Project } from "./project.js";

export class ManifestGenerator {
  static generate(project: Project): Record<string, unknown> {
    return {
      id: project.id,
      name: project.name,
      ownerId: project.ownerId,
      status: project.status,
      description: project.description,
      versions: project.versions.map((version) => ({
        id: version.id,
        number: version.number,
        createdAt: version.createdAt,
        notes: version.notes,
      })),
      assetIds: project.assetIds,
      updatedAt: project.updatedAt,
    };
  }
}
