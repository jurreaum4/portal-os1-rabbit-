export type AgentCommand = "ask" | "explain" | "recommend" | "build" | "report";

export interface AgentContext {
  command: AgentCommand;
  userId: string;
  payload?: Record<string, unknown>;
}

export class AgentRegistry {
  private readonly agents = new Map<string, { name: string; capabilities: AgentCommand[] }>();

  register(name: string, capabilities: AgentCommand[]): void {
    this.agents.set(name, { name, capabilities });
  }

  discover(): { name: string; capabilities: AgentCommand[] }[] {
    return [...this.agents.values()];
  }

  validate(name: string): boolean {
    return this.agents.has(name);
  }
}

export class AgentRuntime {
  constructor(private readonly registry = new AgentRegistry()) {}

  evaluatePermission(userId: string, command: AgentCommand): boolean {
    return Boolean(userId) && Boolean(command);
  }

  execute(context: AgentContext): { ok: boolean; command: AgentCommand; userId: string } {
    if (!this.evaluatePermission(context.userId, context.command)) {
      throw new Error("Permission denied");
    }
    return { ok: true, command: context.command, userId: context.userId };
  }

  auditAction(context: AgentContext, status: "success" | "denied"): Record<string, unknown> {
    return { userId: context.userId, command: context.command, status };
  }

  generateTelemetry(context: AgentContext): Record<string, unknown> {
    return { command: context.command, userId: context.userId, timestamp: new Date().toISOString() };
  }

  routeCommands(context: AgentContext): AgentCommand {
    return context.command;
  }
}
