import type { PaginatedResponse, RebrickableSet, } from "../types/rebrickable";

export async function searchSets(searchTerm: string): Promise<PaginatedResponse<RebrickableSet>> {
    const params = new URLSearchParams({
        search: searchTerm,
    });

    const response = await fetch(`/api/sets?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Unable to serach Rebrickable sets.");
    }

    const data: PaginatedResponse<RebrickableSet> = await response.json();

    return data;
}