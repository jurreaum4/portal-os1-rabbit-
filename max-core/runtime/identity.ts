export interface IdentityRecord {
  id: string;
  displayName: string;
  email?: string;
  roles?: readonly string[];
  createdAt?: string;
}

export class UserIdentity {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
  readonly roles: Set<string>;
  readonly createdAt: string;

  constructor(data: IdentityRecord) {
    this.id = data.id.trim();
    this.displayName = data.displayName.trim();
    this.email = (data.email ?? "").trim();
    this.roles = new Set((data.roles ?? []).map((role) => role.trim().toLowerCase()).filter(Boolean));
    this.createdAt = data.createdAt ?? new Date().toISOString();
  }

  hasRole(role: string): boolean {
    return this.roles.has(role.trim().toLowerCase());
  }

  canAccess(scope: string): boolean {
    const normalized = scope.trim().toLowerCase();
    return this.roles.has(normalized) || this.roles.has("admin");
  }
}

export class IdentityRegistry {
  private readonly users = new Map<string, UserIdentity>();

  register(identity: UserIdentity): UserIdentity {
    if (!identity.id.trim()) {
      throw new Error("Identity id is required");
    }
    this.users.set(identity.id, identity);
    return identity;
  }

  get(id: string): UserIdentity | undefined {
    return this.users.get(id.trim());
  }

  require(id: string): UserIdentity {
    const identity = this.get(id);
    if (!identity) {
      throw new Error(`Identity not found: ${id}`);
    }
    return identity;
  }

  list(): UserIdentity[] {
    return [...this.users.values()];
  }
}
