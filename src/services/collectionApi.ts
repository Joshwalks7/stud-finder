import type { CollectionItem } from "../types/collection";

async function request<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error("Unable to communicate with the collection API.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function loadCollectionFromApi(): Promise<CollectionItem[]> {
  return request<CollectionItem[]>("/api/collection");
}

export function saveCollectionToApi(
  item: CollectionItem,
): Promise<CollectionItem> {
  return request<CollectionItem>("/api/collection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
}

export function updateCollectionQuantityInApi(
  setNum: string,
  quantity: number,
): Promise<{ setNum: string; quantity: number }> {
  return request<{ setNum: string; quantity: number }>(
    `/api/collection/${encodeURIComponent(setNum)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    },
  );
}

export function removeCollectionFromApi(setNum: string): Promise<void> {
  return request<void>(
    `/api/collection/${encodeURIComponent(setNum)}`,
    { method: "DELETE" },
  );
}
