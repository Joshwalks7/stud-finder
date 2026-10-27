import "dotenv/config";
import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3001;
const apiKey = process.env.REBRICKABLE_API_KEY;

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

app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
})