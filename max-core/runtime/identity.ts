export interface IdentityRecord {
  id: string;
  displayName: string;
  email?: string;
  roles?: readonly string[];
  permissions?: readonly string[];
  preferences?: Record<string, string | number | boolean | null>;
  libraryOwnership?: readonly string[];
  createdAt?: string;
}

export class UserIdentity {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
  readonly roles: Set<string>;
  readonly permissions: Set<string>;
  readonly preferences: Map<string, string | number | boolean | null>;
  readonly libraryOwnership: Set<string>;
  readonly createdAt: string;

  constructor(data: IdentityRecord) {
    this.id = data.id.trim();
    this.displayName = data.displayName.trim();
    this.email = (data.email ?? "").trim();
    this.roles = new Set((data.roles ?? []).map((role) => role.trim().toLowerCase()).filter(Boolean));
    this.permissions = new Set(
      (data.permissions ?? []).map((permission) => permission.trim().toLowerCase()).filter(Boolean),
    );
    this.preferences = new Map(
      Object.entries(data.preferences ?? {}).map(([key, value]) => [key.trim(), value]),
    );
    this.libraryOwnership = new Set(
      (data.libraryOwnership ?? []).map((libraryId) => libraryId.trim()).filter(Boolean),
    );
    this.createdAt = data.createdAt ?? new Date().toISOString();
  }

  hasRole(role: string): boolean {
    return this.roles.has(role.trim().toLowerCase());
  }

  hasPermission(scope: string): boolean {
    const normalized = scope.trim().toLowerCase();
    return this.permissions.has(normalized) || this.roles.has("admin") || this.permissions.has("admin");
  }

  hasLibraryAccess(libraryId: string): boolean {
    if (!libraryId.trim()) return false;
    return this.libraryOwnership.has(libraryId.trim()) || this.hasPermission("library:read");
  }

  canAccess(scope: string): boolean {
    const normalized = scope.trim().toLowerCase();
    return this.roles.has(normalized) || this.roles.has("admin") || this.hasPermission(normalized);
  }

  getPreference<T = string | number | boolean | null>(key: string, fallback?: T): T | undefined {
    const value = this.preferences.get(key.trim());
    return value === undefined ? fallback : (value as T);
  }

  toProfile(): Record<string, unknown> {
    return {
      id: this.id,
      displayName: this.displayName,
      email: this.email,
      roles: [...this.roles],
      permissions: [...this.permissions],
      libraryOwnership: [...this.libraryOwnership],
      preferences: Object.fromEntries(this.preferences.entries()),
    };
  }

  static sameIdentity(a: UserIdentity, b: UserIdentity): boolean {
    return a.id === b.id && a.displayName === b.displayName;
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

  has(id: string): boolean {
    return this.get(id) !== undefined;
  }
}
