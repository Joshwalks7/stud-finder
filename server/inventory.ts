import type { RebrickableInventoryPart } from "../src/types/rebrickable";
import type { CollectionItem } from "../src/types/collection";

export type AggregatedPartInventory = Record<string, number>;

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

export async function loadBuildableSetParts(
    setNum: string,
    apiKey: string,
): Promise<RebrickableInventoryPart[]> {
    const url = new URL(
        `https://rebrickable.com/api/v3/lego/sets/${encodeURIComponent(setNum)}/parts/`,
    );

    url.searchParams.set("page_size", "100");
    url.searchParams.set("inc_minifig_parts", "false");

    let nextUrl: string | null = url.toString();
    const results: RebrickableInventoryPart[] = [];

    while (nextUrl) {
        const rebrickableResponse = await fetch(nextUrl, {
            headers: {
                Authorization: `key ${apiKey}`,
            },
        });

        const page = await rebrickableResponse.json() as {
            next: string | null;
            results: RebrickableInventoryPart[];
        };

        if (!rebrickableResponse.ok) {
            throw new Error(`Rebrickable returned status ${rebrickableResponse.status}.`);
        }

        results.push(...page.results);
        nextUrl = page.next;
    }

    return filterBuildableParts(results);
}

export function getPartKey(part: RebrickableInventoryPart): string {
    return `${part.part.part_num}:${part.color.id}`;
}

export function filterBuildableParts(
    parts: RebrickableInventoryPart[],
): RebrickableInventoryPart[] {
    return parts.filter((part) => !part.is_spare);
}

export function aggregateParts(
    parts: RebrickableInventoryPart[],
    setQuantity = 1,
): AggregatedPartInventory {
    return parts.reduce<AggregatedPartInventory>((inventory, part) => {
        const key = getPartKey(part);
        inventory[key] = (inventory[key] ?? 0) + part.quantity * setQuantity;
        return inventory;
    }, {});
}

export async function aggregateCollectionParts(
    collection: CollectionItem[],
    loadSetParts: (setNum: string) => Promise<RebrickableInventoryPart[]>,
): Promise<AggregatedPartInventory> {
    const inventory: AggregatedPartInventory = {};

    for (const item of collection) {
        const parts = await loadSetParts(item.set.set_num);
        const setInventory = aggregateParts(parts, item.quantity);

        for (const [key, quantity] of Object.entries(setInventory)) {
            inventory[key] = (inventory[key] ?? 0) + quantity;
        }
    }

    return inventory;
}

export function compareInventories(
    availableInventory: AggregatedPartInventory,
    targetParts: RebrickableInventoryPart[],
): BuildabilitySummary {
    const targetInventory = aggregateParts(targetParts);
    const parts = Object.entries(targetInventory).map(([key, required]) => {
        const available = availableInventory[key] ?? 0;
        const used = Math.min(available, required);

        return {
            key,
            available,
            required,
            used,
            missing: required - used,
        };
    });

    const requiredPieces = parts.reduce((total, part) => total + part.required, 0);
    const usedPieces = parts.reduce((total, part) => total + part.used, 0);
    const availablePieces = parts.reduce((total, part) => total + part.available, 0);
    const missingPieces = requiredPieces - usedPieces;

    return {
        percentage: requiredPieces === 0
            ? 0
            : Math.round((usedPieces / requiredPieces) * 100),
        availablePieces,
        requiredPieces,
        usedPieces,
        missingPieces,
        parts,
    };
}
