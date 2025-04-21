export type BreakdownEntry = {
  month: number;
  principal: number;
  interest: number;
  remainingPrincipal: number;
};

export type TimelineVisualizerProps = {
  breakdown: BreakdownEntry[];
};


