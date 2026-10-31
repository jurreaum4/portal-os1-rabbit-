export interface InstallRecordData {
  id: string;
  productId: string;
  userId: string;
  libraryId: string;
  installedAt: string;
  status: "installed" | "upgraded" | "removed";
}

export class InstallRecord {
  readonly id: string;
  readonly productId: string;
  readonly userId: string;
  readonly libraryId: string;
  readonly installedAt: string;
  status: InstallRecordData["status"];

  constructor(data: InstallRecordData) {
    this.id = data.id;
    this.productId = data.productId;
    this.userId = data.userId;
    this.libraryId = data.libraryId;
    this.installedAt = data.installedAt;
    this.status = data.status;
  }
}
