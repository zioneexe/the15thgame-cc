export interface Risk {
  category: string;
  risk: string;
  probability: number;
  impact: number;
  totalRiskScore: number;
  mitigationStrategy: string;
  status: string;
  comments: string;
  projectId: string;
}

export interface RiskFilters {
  category: string;
  status: string;
  minRiskScore: string;
  maxRiskScore: string;
}

export interface CategoryCounts {
  low: number;
  medium: number;
  high: number;
}

export interface BreakdownData {
  category: string;
  Low: number;
  Medium: number;
  High: number;
  total: number;
}

export interface ScatterDataPoint {
  x: number;
  y: number;
  z: number;
  risks: Risk[];
  totalScore: number;
}

export interface GridHeatmapData {
  [key: string]: Risk[];
}