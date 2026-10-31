export interface WorldBootResult {
  booted: boolean;
  sceneLoaded: boolean;
  nexusReady: boolean;
}

export class WorldRuntime {
  private bootedState = false;
  private playerId: string | null = null;
  private activeDistrict = "portal";
  private launchedContentId: string | null = null;

  boot(): WorldBootResult {
    this.bootedState = true;
    return {
      booted: true,
      sceneLoaded: true,
      nexusReady: true,
    };
  }

  spawnPlayer(): { playerId: string; spawnPoint: string } {
    if (!this.bootedState) this.boot();
    this.playerId = `player-${crypto.randomUUID()}`;
    this.activeDistrict = "nexus";
    return { playerId: this.playerId, spawnPoint: "nexus" };
  }

  loadDistrict(district: string): { district: string; loaded: boolean } {
    const normalized = district.trim();
    if (!normalized) {
      throw new Error("District name is required");
    }
    this.activeDistrict = normalized;
    return { district: normalized, loaded: true };
  }

  teleport(from: string, to: string): { from: string; to: string; success: boolean } {
    const source = from.trim();
    const target = to.trim();
    if (!source || !target) {
      throw new Error("Teleport requires valid from and to districts");
    }
    this.activeDistrict = target;
    return { from: source, to: target, success: true };
  }

  launchContent(contentId: string): { contentId: string; launched: boolean } {
    const normalized = contentId.trim();
    if (!normalized) {
      throw new Error("Content id is required");
    }
    this.launchedContentId = normalized;
    return { contentId: normalized, launched: true };
  }

  updateHud(label: string): { label: string; visible: boolean } {
    const normalized = label.trim();
    if (!normalized) {
      throw new Error("Hud label is required");
    }
    return { label: normalized, visible: true };
  }

  returnPortal(): { destination: string; success: boolean } {
    this.activeDistrict = "portal";
    return { destination: "portal", success: true };
  }
}
