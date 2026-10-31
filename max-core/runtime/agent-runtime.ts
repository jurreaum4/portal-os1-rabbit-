export type AgentCommand = "ask" | "explain" | "guide" | "build" | "report" | "recommend";

export interface AgentContext {
  command: AgentCommand;
  userId: string;
  payload?: Record<string, unknown>;
}

export class AgentRegistry {
  private readonly agents = new Map<string, { name: string; capabilities: AgentCommand[] }>();

  register(name: string, capabilities: AgentCommand[]): void {
    this.agents.set(name, { name, capabilities: [...new Set(capabilities)] });
  }

  discover(): { name: string; capabilities: AgentCommand[] }[] {
    return [...this.agents.values()].map((agent) => ({
      name: agent.name,
      capabilities: [...agent.capabilities],
    }));
  }

  validate(name: string): boolean {
    return this.agents.has(name);
  }

  hasCapability(command: AgentCommand): boolean {
    return [...this.agents.values()].some((agent) => agent.capabilities.includes(command));
  }
}

export class AgentRuntime {
  constructor(private readonly registry = new AgentRegistry()) {}

  evaluatePermission(userId: string, command: AgentCommand): boolean {
    if (!userId.trim()) return false;
    if (this.registry.discover().length === 0) return true;
    return this.registry.hasCapability(command);
  }

  execute(context: AgentContext): { ok: boolean; command: AgentCommand; userId: string } {
    if (!this.evaluatePermission(context.userId, context.command)) {
      throw new Error("Permission denied");
    }
    return { ok: true, command: context.command, userId: context.userId };
  }

  auditAction(context: AgentContext, status: "success" | "denied"): Record<string, unknown> {
    return {
      userId: context.userId,
      command: context.command,
      status,
      payload: context.payload ?? {},
      recordedAt: new Date().toISOString(),
    };
  }

  generateTelemetry(context: AgentContext): Record<string, unknown> {
    return {
      command: context.command,
      userId: context.userId,
      payload: context.payload ?? {},
      timestamp: new Date().toISOString(),
    };
  }

  routeCommands(context: AgentContext): AgentCommand {
    return context.command;
  }
}
