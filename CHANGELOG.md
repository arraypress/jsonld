# Changelog

All notable changes to `@arraypress/jsonld` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Entries before 1.5.0 were reconstructed from the git history and npm publish
dates, so they record what each release changed rather than how it was written
up at the time.

## [1.5.0] — 2026-09-04

### Added

- `buildGraph(nodes, options)` — combines builder output into one connected
  `@graph`. Emitting several builders side by side is legal, but it describes
  several *unrelated* things: nothing says the Article was published by the
  Organization, or that the WebPage belongs to the WebSite. This assigns each
  node a stable `@id` and wires the references between them —
  `WebSite.publisher`, `WebPage.isPartOf`, `WebPage.breadcrumb`,
  `Article.mainEntityOfPage` / `isPartOf` / `publisher` / `author`, and
  `WebPage.about` on the homepage only.

  Site entities (WebSite, Organization, Person) key on the origin so every page
  in a crawl references the same node; everything else keys on the page URL. A
  per-page Organization is, to a crawler, a different Organization on every
  page — that split is the point of the exercise.

  Inferred links apply only when both nodes are present, and never over a value
  the caller set explicitly.

- Graph output validated against the Schema.org vocabulary in
  `validate/schema.ts`. schema-dts models `{'@id': …}` as `IdReference`, so the
  sample only type-checks if a bare reference is genuinely legal everywhere the
  graph emits one; a runtime test then asserts the builder emits exactly what
  that sample validates.

## [1.4.0] — 2026-08-18

### Added

- Sector coverage for directory sites — nine builders: `itemList`, `menu`,
  `menuSection`, `menuItem`, `realEstateListing`, `accommodation`,
  `musicGroup`, `musicAlbum`, `musicRecording`.
- A `type` option on `localBusiness()`, `organization()`, `event()` and
  `accommodation()` covering their whole Schema.org subtype tree, so one
  directory codebase serves dentists, restaurants, garages, venues and estate
  agents.
- Opening-hours support via `OpeningHoursSpecification`, accepting the common
  day abbreviations and normalising them to the full English names Schema.org
  wants. A closed day is expressed as `opens === closes === '00:00'`, Google's
  documented convention — omitting the day says "unknown", which is not the
  same thing.

## [1.3.0] — 2026-08-01

### Added

- `definedTerm()` and `quiz()`.

## [1.2.0] — 2026-06-22

### Added

- `offerUrl` on `product()`, so the Offer can point at a separate buy link
  while the Product keeps its own page URL. Falls back to the product URL when
  omitted.

## [1.1.0] — 2026-06-22

### Added

- Thirteen builders covering the common site types: `person`, `webPage`,
  `profilePage`, `newsArticle`, `recipe`, `videoObject`, `imageObject`,
  `review`, `aggregateRating`, `offer`, `jobPosting`, `course`, `service`.
- An `extra` passthrough on every builder, merged last — the escape hatch for
  Schema.org properties a builder doesn't model, so you can declare the common
  90% and bolt on the long tail.
- Static validation of every builder's output against the official Schema.org
  vocabulary via `schema-dts`. `npm run validate` fails if a shape is invalid.

## [1.0.0] — 2026-04-05

### Added

- Initial release: twelve builders — `product`, `article`, `blogPosting`,
  `breadcrumb`, `faq`, `howTo`, `event`, `localBusiness`, `organization`,
  `webSite`, `collectionPage`, `softwareApplication`.
- Every builder returns a complete object with `@context`. Zero dependencies.
- JSDoc on all exports.
