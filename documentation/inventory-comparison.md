# Inventory Comparison Feature

## Last updated

November 25, 2026

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

### Backend inventory processing

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
server. It requests 100 records per page, explicitly sets
`inc_minifig_parts=false`, follows Rebrickable's `next` URL, removes spare
parts, and returns one combined response to the caller.

Inventory-related interfaces were added to:

```text
src/types/rebrickable.ts
```

The project passed ESLint and the production TypeScript/Vite build after these
changes.

The backend now also provides:

```text
GET /api/sets/:setNum/buildability
```

This protected endpoint uses the signed-in user's collection, loads the
filtered inventories for owned sets, applies collection quantities, loads the
target set, and returns a buildability summary.

The comparison logic is implemented in `server/inventory.ts`:

- `filterBuildableParts()` removes spare parts.
- `aggregateParts()` creates `part_num:color_id` inventory keys.
- `aggregateCollectionParts()` combines all owned sets and quantities.
- `compareInventories()` calculates capped usable pieces and the percentage.

### Frontend experience

The Home page search cards keep collection and wishlist actions, but do not
request buildability. This prevents one search from creating many expensive
API requests.

The Explore page handles one target set at a time. It includes:

- A set-number search form.
- A mobile-first percentage and progress bar.
- Required, available, usable, and missing counts.
- A missing-parts list.
- Loading, error, and signed-out states.
- Links from Home page results to Explore details.

Validation completed during this work:

```text
npm run lint
npm run build
```

## Confirmed API observations

The Millennium Falcon inventory response returned:

- `count: 726`
- `page_size: 100`
- A `next` URL pointing to page 2
- Inventory records containing `part`, `color`, `quantity`, and `is_spare`
- Top-level inventory fields such as `id`, `inv_part_id`, and `element_id`
- Part data such as `part_num`, `name`, `part_cat_id`, `part_url`,
  `part_img_url`, and `external_ids`
- Color data such as `id`, `name`, `rgb`, `is_trans`, and `external_ids`

These confirmed observations are represented in `src/types/rebrickable.ts`.
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

The `external_ids` objects are represented as flexible records because the
provider names and value shapes are API metadata, not part of the comparison
identity. Their complete provider-specific shapes have not been verified.

## Important incomplete areas

- Pagination now follows Rebrickable's `next` URL and returns all inventory
  pages in one response.
- Pagination response handling has not yet been verified against several
  different set sizes.
- Rebrickable's minifigure exclusion is explicitly requested, but should still
  be verified with a set that contains minifigures.
- The UI currently displays part keys such as `3001:1`, not part names or
  images.
- The response does not yet identify which owned sets contributed each part.
- An incomplete set number such as `75280` can produce an empty comparison;
  full Rebrickable numbers such as `75280-1` should be used.
- The empty-inventory state currently displays `0%` and zero counts and should
  be given a clearer message.
- Buildability requests can still be expensive because one Explore comparison
  loads the target and each owned set inventory.
- Inventory caching has not been designed or implemented.
- The deployed Beanstalk version must be rebuilt and tested after these
  changes.

## Ordered next-session checklist

### Highest priority

1. Test Explore with a valid full set number such as `75280-1`.
2. Test with an empty collection, one owned set, and multiple owned sets.
3. Improve the empty-inventory and invalid-set-number messages.
4. Confirm signed-out users cannot access another user's buildability data.
5. Rebuild and deploy the project to Elastic Beanstalk, then test the deployed
   URL.

### Later improvements

6. Return part names, colors, and images for the missing-parts list.
7. Show which owned sets contributed each available part.
8. Add caching or stored normalized inventories to reduce Rebrickable requests.
9. Ask the Security Analyst to review user isolation, API exposure, and
   excessive Rebrickable requests.
10. Consider a focused test framework only if the project needs more automated
    coverage.

The comparison formula is:

   ```text
   sum(min(available, required)) / sum(required) * 100
   ```

## Agent coordination notes

- Backend Agent owns Rebrickable inventory retrieval, pagination, filtering,
  aggregation, and percentage calculations.
- Frontend Agent owns the progress display and Explore-page experience.
- AWS Agent may later help evaluate DynamoDB caching or stored inventories.
- Security Analyst performs read-only reviews and reports findings to Sarah.
- Sarah coordinates cross-agent work and asks the learner before major changes.

