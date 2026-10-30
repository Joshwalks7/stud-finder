import type { CollectionItem } from "../types/collection";

const COLLECTION_STORAGE_KEY = "stud-finder.collection";

export function loadCollection(): CollectionItem[] {
  const storedCollection = localStorage.getItem(COLLECTION_STORAGE_KEY);

  if (!storedCollection) {
    return [];
  }

  try {
    const parsedCollection: unknown = JSON.parse(storedCollection);

    if (Array.isArray(parsedCollection)) {
      return parsedCollection as CollectionItem[];
    }

    return [];
  } catch {
    return [];
  }
}

export function saveCollection(items: CollectionItem[]): void {
  localStorage.setItem(
    COLLECTION_STORAGE_KEY,
    JSON.stringify(items),
  );
}