export interface OwnershipData {
  actorId: string;
  entityType: string;
  entityId: string;
  ownerId: string;
  grantedAt: string;
}

export class Ownership {
  readonly actorId: string;
  readonly entityType: string;
  readonly entityId: string;
  readonly ownerId: string;
  readonly grantedAt: string;

  constructor(data: OwnershipData) {
    this.actorId = data.actorId;
    this.entityType = data.entityType;
    this.entityId = data.entityId;
    this.ownerId = data.ownerId;
    this.grantedAt = data.grantedAt;
  }

  isOwner(candidateId: string): boolean {
    return candidateId === this.ownerId;
  }
}
