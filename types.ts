
export interface TokenUsage {
  promptTokens: number;
  outputTokens: number;
  totalTokens: number;
  baseTokens: number;
  promptPartTokens: number;
}

export interface SimulationResult {
  output: string;
  usage: TokenUsage;
  latencyMs: number;
}

export interface ComparisonState {
  simple: SimulationResult | null;
  context: SimulationResult | null;
}

export enum PromptType {
  SIMPLE = 'SIMPLE',
  CONTEXT_RICH = 'CONTEXT_RICH'
}
