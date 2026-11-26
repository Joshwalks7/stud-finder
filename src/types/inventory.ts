export interface PartComparison {
  key: string;
  available: number;
  required: number;
  used: number;
  missing: number;
}

export interface BuildabilitySummary {
  percentage: number;
  availablePieces: number;
  requiredPieces: number;
  usedPieces: number;
  missingPieces: number;
  parts: PartComparison[];
}

