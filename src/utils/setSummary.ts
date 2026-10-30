import type { RebrickableSet } from "../types/rebrickable";

export type SetSummary = [
  setNumber: string,
  name: string,
  pieceCount: number,
];

export function createSetSummary(
  set: RebrickableSet,
): SetSummary {
  return [
    set.set_num,
    set.name,
    set.num_parts,
  ];
}