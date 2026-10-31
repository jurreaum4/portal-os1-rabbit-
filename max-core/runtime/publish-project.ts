import type { Project } from "./project.js";
import { ValidateProject } from "./validate-project.js";
import { AuditLog } from "./audit-log.js";

export class PublishProject {
  private readonly audits: AuditLog;

  constructor(auditLog = new AuditLog()) {
    this.audits = auditLog;
  }

  run(project: Project): { project: Project; manifest: Record<string, unknown> } {
    const issues = ValidateProject.run(project);
    if (issues.length > 0) {
      throw new Error(`Project validation failed: ${issues.map((issue) => issue.message).join(", ")}`);
    }
    project.publish();
    this.audits.append({
      actorId: project.ownerId,
      entityType: "project",
      entityId: project.id,
      action: "publish",
      status: "success",
      metadata: { versionCount: project.versions.length },
    });
    const manifest = {
      id: project.id,
      name: project.name,
      ownerId: project.ownerId,
      status: project.status,
      versions: project.versions.map((version) => ({
        id: version.id,
        number: version.number,
        createdAt: version.createdAt,
        notes: version.notes,
      })),
      updatedAt: project.updatedAt,
    };
    project.manifest = manifest;
    return { project, manifest };
  }
}
