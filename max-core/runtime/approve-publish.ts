import type { Project } from "./project.js";

export class ApprovePublish {
  static run(project: Project, approvedBy: string, notes = "approved"): Project {
    if (project.status !== "published") {
      throw new Error("Project must be published before approval");
    }
    project.status = "published";
    project.description = `${project.description} :: approved by ${approvedBy} :: ${notes}`;
    return project;
  }
}
