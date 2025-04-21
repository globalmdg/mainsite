export type BreakdownEntry = {
  month: number;
  principal: number;
  interest: number;
  remainingPrincipal: number;
};

export type TimelineVisualizerProps = {
  breakdown: MonthlyBreakdown[];
};


export type MonthlyBreakdown = {
  month: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  remainingPrincipal: number;
};