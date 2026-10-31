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
}

export interface GovernanceDecision {
  allowed: boolean;
  actorId: string;
  action: GovernanceAction;
  resourceType: string;
  resourceId?: string;
  reason?: string;
}

export class GovernanceRuntime {
  constructor(private readonly identities: Map<string, UserIdentity> = new Map()) {}

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

    if (context.resourceOwnerId && context.resourceOwnerId === actor.id) {
      return {
        allowed: true,
        actorId: actor.id,
        action: context.action,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
      };
    }

    const roles = new Set((context.roles ?? []).map((role) => role.trim().toLowerCase()));
    for (const role of roles) {
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

    if (context.action === "admin" && actor.hasRole("admin")) {
      return {
        allowed: true,
        actorId: actor.id,
        action: context.action,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
      };
    }

    if (actor.hasRole("admin")) {
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
}
