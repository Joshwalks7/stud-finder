# Inventory Comparison Feature

## Session date

November 18, 2026

## Feature goal

Show how much of a target LEGO set a user could build using the pieces from
their own collection.

The first version will:

- Match exact part numbers and colors.
- Combine pieces from every owned set.
- Multiply pieces by the quantity of each owned set.
- Exclude spare parts.
- Exclude minifigures.
- Display the percentage of required non-minifigure pieces available.

The Explore page may later show missing pieces, quantities, and which owned
sets contributed available pieces.

## Work completed

The Backend Agent researched the Rebrickable set-inventory endpoint. A backend
proxy was added to `server/index.ts`:

```text
GET /api/sets/:setNum/parts
```

Example local request:

```text
http://localhost:3001/api/sets/75192-1/parts
```

The route forwards the request to Rebrickable while keeping the API key on the
server. It currently requests 100 records per page and returns the response to
the caller.

Inventory-related interfaces were added to:

```text
src/types/rebrickable.ts
```

The project passed ESLint and the production TypeScript/Vite build after these
changes.

## Confirmed API observations

The Millennium Falcon inventory response returned:

- `count: 726`
- `page_size: 100`
- A `next` URL pointing to page 2
- Inventory records containing `part`, `color`, `quantity`, and `is_spare`
- Part data such as `part_num`, `name`, `part_cat_id`, and image information
- Color data such as `id`, `name`, and RGB value

The response contains more fields than the initial TypeScript interfaces, such
as top-level `id`, `part_url`, `external_ids`, and transparency information.
The comparison algorithm only needs:

```text
part.part_num
color.id
quantity
is_spare
```

The natural comparison key is:

```text
`${part_num}:${color_id}`
```

This keeps the same LEGO shape in different colors separate.

## Important incomplete areas

- The endpoint currently returns only the first page.
- Pagination has not been implemented.
- The actual minifigure exclusion behavior still needs verification.
- Spare-part filtering has not been implemented.
- Inventory aggregation has not been implemented.
- Collection quantities have not yet been applied to inventory quantities.
- Percentage calculation has not been implemented.
- No progress bar or Explore-page UI has been added.
- Inventory caching has not been designed or implemented.

## Ordered next-session checklist

1. Update `src/types/rebrickable.ts` to match the confirmed inventory response
   without adding unnecessary fields.
2. Add backend pagination so all inventory pages are retrieved.
3. Verify how minifigures are represented when the optional minifigure setting
   is omitted.
4. Create a small backend filtering function that removes spare parts and
   minifigures.
5. Add a focused test or controlled manual check for the filtering function.
6. Define the internal aggregated-part structure using `part_num:color_id` as
   the key.
7. Aggregate inventories from the user's collection and multiply by owned set
   quantity.
8. Compare the aggregated collection against one target set.
9. Calculate piece coverage percentage using capped quantities:

   ```text
   sum(min(available, required)) / sum(required) * 100
   ```

10. Add a backend endpoint that returns the target set's coverage summary.
11. Have the Frontend Agent add a mobile-first percentage display to set cards.
12. Expand the Explore page with missing-piece details and contributing sets.
13. Ask the Security Analyst to review the new endpoints for user isolation,
    API exposure, and excessive Rebrickable requests.
14. Add caching or stored normalized inventories before making large-scale API
    requests.

## Agent coordination notes

- Backend Agent owns Rebrickable inventory retrieval, pagination, filtering,
  aggregation, and percentage calculations.
- Frontend Agent owns the progress display and Explore-page experience.
- AWS Agent may later help evaluate DynamoDB caching or stored inventories.
- Security Analyst performs read-only reviews and reports findings to Sarah.
- Sarah coordinates cross-agent work and asks the learner before major changes.

