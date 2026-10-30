import type {
  PaginatedResponse,
  RebrickableSet,
} from "../types/rebrickable";

export class RebrickableApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "RebrickableApiError";
    this.status = status;
  }
}

export async function searchSets(
  searchTerm: string,
): Promise<PaginatedResponse<RebrickableSet>> {
  const params = new URLSearchParams({
    search: searchTerm,
  });

  const response = await fetch(`/api/sets?${params.toString()}`);

  if (!response.ok) {
    throw new RebrickableApiError(
      "Unable to search Rebrickable sets.",
      response.status,
    );
  }

  const data: PaginatedResponse<RebrickableSet> =
    await response.json();

  return data;
}