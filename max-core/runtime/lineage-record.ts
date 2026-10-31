export type LineageKind = "create" | "edit" | "publish" | "replay";

export interface LineageRecordData {
  id: string;
  projectId: string;
  parentId?: string;
  versionId?: string;
  kind: LineageKind;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export class LineageRecord {
  readonly id: string;
  readonly projectId: string;
  readonly parentId?: string;
  readonly versionId?: string;
  readonly kind: LineageKind;
  readonly createdAt: string;
  readonly metadata?: Record<string, unknown>;

  constructor(data: LineageRecordData) {
    this.id = data.id;
    this.projectId = data.projectId;
    this.parentId = data.parentId;
    this.versionId = data.versionId;
    this.kind = data.kind;
    this.createdAt = data.createdAt;
    this.metadata = data.metadata;
  }
}

export class LineageService {
  private readonly records = new Map<string, LineageRecord[]>();

  append(record: LineageRecord): LineageRecord {
    const entries = this.records.get(record.projectId) ?? [];
    entries.push(record);
    this.records.set(record.projectId, entries);
    return record;
  }

  get(projectId: string): LineageRecord[] {
    return this.records.get(projectId) ?? [];
  }

  replayMetadata(projectId: string): Record<string, unknown>[] {
    return this.get(projectId).map((record) => ({
      id: record.id,
      projectId: record.projectId,
      kind: record.kind,
      versionId: record.versionId,
      createdAt: record.createdAt,
      metadata: record.metadata ?? {},
    }));
  }
}
