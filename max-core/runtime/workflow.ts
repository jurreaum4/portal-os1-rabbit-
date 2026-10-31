export type WorkflowStep = {
  name: string;
  run: () => Promise<unknown> | unknown;
};

export type WorkflowResult = {
  step: string;
  ok: boolean;
  value?: unknown;
  error?: string;
};

export class WorkflowOrchestrator {
  private readonly steps: WorkflowStep[] = [];

  addStep(name: string, run: () => Promise<unknown> | unknown): WorkflowOrchestrator {
    this.steps.push({ name, run });
    return this;
  }

  async run(): Promise<WorkflowResult[]> {
    const results: WorkflowResult[] = [];
    for (const step of this.steps) {
      try {
        const value = await step.run();
        results.push({ step: step.name, ok: true, value });
      } catch (error) {
        results.push({
          step: step.name,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    return results;
  }
}
