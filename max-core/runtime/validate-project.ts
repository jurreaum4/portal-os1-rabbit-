import type { Project } from "./project.js";

export interface ValidationIssue {
  path: string;
  message: string;
}

export class ValidateProject {
  static run(project: Project): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    if (!project.name.trim()) {
      issues.push({ path: "name", message: "Project name is required" });
    }
    if (project.ownerId.trim().length === 0) {
      issues.push({ path: "ownerId", message: "Project must have an owner" });
    }
    return issues;
  }
}
