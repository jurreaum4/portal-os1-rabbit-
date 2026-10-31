import { Project, Version, type ProjectInput } from "./project.js";

export class ProjectRepository {
  private readonly projects = new Map<string, Project>();

  createProject(input: ProjectInput): Project {
    const project = Project.create(input);
    this.projects.set(project.id, project);
    return project;
  }

  getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  listByOwner(ownerId: string): Project[] {
    return [...this.projects.values()].filter((project) => project.ownerId === ownerId);
  }

  addVersion(id: string, version: { number: number; notes?: string }): Project {
    const project = this.projects.get(id);
    if (!project) throw new Error(`Project not found: ${id}`);

    const nextVersion = new Version(project.id, version.number, version.notes ?? "");
    project.addVersion(nextVersion);
    return project;
  }
}
