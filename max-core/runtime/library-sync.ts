import type { InstallRecord } from "./install-record.js";

export class LibrarySync {
  private readonly installed = new Map<string, InstallRecord>();

  sync(record: InstallRecord): InstallRecord {
    this.installed.set(record.id, record);
    return record;
  }

  getInstalled(productId: string): InstallRecord[] {
    return [...this.installed.values()].filter((entry) => entry.productId === productId);
  }
}
