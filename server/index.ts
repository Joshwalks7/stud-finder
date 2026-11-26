import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionItem } from "../src/types/collection";
import type { WishlistItem } from "../src/types/wishlist";
import { getAuthenticatedUserId, requireAuth } from "./auth";
import {
    aggregateCollectionParts,
    compareInventories,
    loadBuildableSetParts,
} from "./inventory";
import {
    listCollection,
    listWishlist,
    removeCollectionItem,
    removeWishlistItem,
    saveCollectionItem,
    saveWishlistItem,
    updateCollectionQuantity,
} from "./dynamoDb";

const app = express();
const port = Number(process.env.PORT) || 3001;
const apiKey = process.env.REBRICKABLE_API_KEY;
const currentFilePath = fileURLToPath(import.meta.url);
const serverDirectory = path.dirname(currentFilePath);
const frontendDirectory = path.resolve(serverDirectory, "../dist");

app.use(express.json());

if (!apiKey) {
    throw new Error("REBRICKABLE_API_KEY is missing from the environment.");
}

app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
});

app.get("/api/sets", async (request, response) => {
    const search = typeof request.query.search === "string"
        ? request.query.search.trim()
        : "";
    
        if (!search) {
            response.status(400).json({
                message: "A search term is required",
            });
            return;
        }

        const url = new URL(
            "https://rebrickable.com/api/v3/lego/sets/",
        );

        url.searchParams.set("search", search);
        url.searchParams.set("page_size", "20");

        try {
            const rebrickableResponse = await fetch(url, {
                headers: {
                    Authorization: `key ${apiKey}`,
                },
            });

            const data: unknown = await rebrickableResponse.json();

            response.status(rebrickableResponse.status).json(data);
        } catch {
            response.status(500).json({
                message: "Unable to contact Rebrickable.",
            });
        }
});

app.get("/api/sets/:setNum/parts", async (request, response) => {
    const setNum = request.params.setNum.trim();

    if (!setNum) {
        response.status(400).json({ message: "A set number is required." });
        return;
    }

    try {
        const buildableResults = await loadBuildableSetParts(setNum, apiKey);

        response.json({
            count: buildableResults.length,
            page_size: 100,
            next: null,
            previous: null,
            results: buildableResults,
        });
    } catch {
        response.status(500).json({
            message: "Unable to retrieve the set inventory from Rebrickable.",
        });
    }
});

app.get("/api/sets/:setNum/buildability", requireAuth, async (request, response) => {
    const setNum = request.params.setNum.trim();

    if (!setNum) {
        response.status(400).json({ message: "A target set number is required." });
        return;
    }

    try {
        const collection = await listCollection(getAuthenticatedUserId(response));
        const availableInventory = await aggregateCollectionParts(
            collection,
            (ownedSetNum) => loadBuildableSetParts(ownedSetNum, apiKey),
        );
        const targetParts = await loadBuildableSetParts(setNum, apiKey);

        response.json(compareInventories(availableInventory, targetParts));
    } catch (error) {
        console.error("Buildability comparison error:", error);
        response.status(500).json({ message: "Unable to calculate set buildability." });
    }
});

app.get("/api/collection", requireAuth, async (_request, response) => {
    try {
        response.json(await listCollection(getAuthenticatedUserId(response)));
    } catch (error) {
        console.error("Collection load error:", error);
        response.status(500).json({ message: "Unable to load the collection." });
    }
});

app.post("/api/collection", requireAuth, async (request, response) => {
    const item = request.body as CollectionItem;

    if (!item?.set?.set_num || !Number.isInteger(item.quantity) || item.quantity < 1) {
        response.status(400).json({ message: "A valid collection item is required." });
        return;
    }

    try {
        await saveCollectionItem(getAuthenticatedUserId(response), item);
        response.status(201).json(item);
    } catch {
        response.status(500).json({ message: "Unable to save the collection item." });
    }
});

app.patch("/api/collection/:setNum", requireAuth, async (request, response) => {
    const quantity = request.body?.quantity;

    if (!Number.isInteger(quantity) || quantity < 1) {
        response.status(400).json({ message: "Quantity must be a positive integer." });
        return;
    }

    try {
        await updateCollectionQuantity(getAuthenticatedUserId(response), request.params.setNum, quantity);
        response.json({ setNum: request.params.setNum, quantity });
    } catch {
        response.status(500).json({ message: "Unable to update the collection item." });
    }
});

app.delete("/api/collection/:setNum", requireAuth, async (request, response) => {
    try {
        await removeCollectionItem(getAuthenticatedUserId(response), request.params.setNum);
        response.status(204).send();
    } catch {
        response.status(500).json({ message: "Unable to remove the collection item." });
    }
});

app.get("/api/wishlist", requireAuth, async (_request, response) => {
    try {
        response.json(await listWishlist(getAuthenticatedUserId(response)));
    } catch {
        response.status(500).json({ message: "Unable to load the wishlist." });
    }
});

app.post("/api/wishlist", requireAuth, async (request, response) => {
    const item = request.body as WishlistItem;

    if (!item?.set?.set_num || !item.addedAt) {
        response.status(400).json({ message: "A valid wishlist item is required." });
        return;
    }

    try {
        await saveWishlistItem(getAuthenticatedUserId(response), item);
        response.status(201).json(item);
    } catch {
        response.status(500).json({ message: "Unable to save the wishlist item." });
    }
});

app.delete("/api/wishlist/:setNum", requireAuth, async (request, response) => {
    try {
        await removeWishlistItem(getAuthenticatedUserId(response), request.params.setNum);
        response.status(204).send();
    } catch {
        response.status(500).json({ message: "Unable to remove the wishlist item." });
    }
});

app.use(express.static(frontendDirectory));

app.use((request, response, next) => {
    if (request.method === "GET" && !request.path.startsWith("/api/")) {
        response.sendFile(path.join(frontendDirectory, "index.html"), (error) => {
            if (error) next(error);
        });
        return;
    }

    next();
});

app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
})
