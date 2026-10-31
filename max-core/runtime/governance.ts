import type { UserIdentity } from "./identity.js";

export type GovernanceAction =
  | "read"
  | "write"
  | "publish"
  | "install"
  | "launch"
  | "ai"
  | "admin";

export interface GovernanceContext {
  actorId: string;
  action: GovernanceAction;
  resourceType: string;
  resourceId?: string;
  resourceOwnerId?: string;
  roles?: readonly string[];
  permission?: string;
}

export interface GovernanceDecision {
  allowed: boolean;
  actorId: string;
  action: GovernanceAction;
  resourceType: string;
  resourceId?: string;
  reason?: string;
}

export type GovernancePolicy = {
  action: GovernanceAction;
  resourceType?: string;
  requiredRoles?: readonly string[];
  allowOwner?: boolean;
};

export class GovernanceRuntime {
  constructor(
    private readonly identities: Map<string, UserIdentity> = new Map(),
    private readonly policyCatalog: Record<string, GovernancePolicy> = {},
  ) {}

  private normalizeRole(role: string): string {
    return role.trim().toLowerCase();
  }

  authorize(context: GovernanceContext): GovernanceDecision {
    const actor = this.identities.get(context.actorId);

    if (!actor) {
      return {
        allowed: false,
        actorId: context.actorId,
        action: context.action,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
        reason: "Identity not found",
      };
    }

    const policyKey = `${context.resourceType}:${context.action}`;
    const policy =
      this.policyCatalog[policyKey] ??
      this.policyCatalog[context.action] ??
      this.policyCatalog[context.resourceType] ??
      undefined;

    if (context.resourceOwnerId && context.resourceOwnerId === actor.id && (policy?.allowOwner ?? true)) {
      return {
        allowed: true,
        actorId: actor.id,
        action: context.action,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
      };
    }

    const roleSet = new Set((context.roles ?? []).map((role) => this.normalizeRole(role)));
    for (const role of roleSet) {
      if (actor.hasRole(role)) {
        return {
          allowed: true,
          actorId: actor.id,
          action: context.action,
          resourceType: context.resourceType,
          resourceId: context.resourceId,
        };
      }
    }

    const requiredRoles = (policy?.requiredRoles ?? []).map((role) => this.normalizeRole(role));
    for (const requiredRole of requiredRoles) {
      if (actor.hasRole(requiredRole)) {
        return {
          allowed: true,
          actorId: actor.id,
          action: context.action,
          resourceType: context.resourceType,
          resourceId: context.resourceId,
        };
      }
    }

    if (context.permission && actor.hasPermission(context.permission)) {
      return {
        allowed: true,
        actorId: actor.id,
        action: context.action,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
      };
    }

    if (context.action === "admin" && actor.hasRole("admin")) {
      return {
        allowed: true,
        actorId: actor.id,
        action: context.action,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
      };
    }

    if (actor.hasRole("admin") || actor.hasPermission("admin")) {
      return {
        allowed: true,
        actorId: actor.id,
        action: context.action,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
      };
    }

    return {
      allowed: false,
      actorId: actor.id,
      action: context.action,
      resourceType: context.resourceType,
      resourceId: context.resourceId,
      reason: "Permission denied",
    };
  }

  requireAllowed(context: GovernanceContext): void {
    const decision = this.authorize(context);
    if (!decision.allowed) {
      throw new Error(decision.reason ?? "Permission denied");
    }
  }

  registerPolicy(policy: GovernancePolicy): void {
    const key = policy.resourceType ? `${policy.resourceType}:${policy.action}` : policy.action;
    this.policyCatalog[key] = policy;
  }
}
