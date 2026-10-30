import type { RebrickableSet } from "./rebrickable";

export interface CollectionItem {
  set: RebrickableSet;
  quantity: number;
  addedAt: string;
}