# @arraypress/jsonld

JSON-LD structured data builders for SEO — the markup that turns a plain blue link into a rich result with stars, prices, opening hours or a carousel. Content, commerce, local business, property, music and careers. Zero dependencies.

## Installation

```bash
npm install @arraypress/jsonld
```

## Usage

```js
import { product, breadcrumb, faq } from '@arraypress/jsonld';

const ld = product({ name: 'Widget', url: 'https://example.com/widget', price: 9.99, currency: 'usd' });
```

## API

All functions return a plain object with `@context: "https://schema.org"`.

**Commerce** — `product(options)` (offers, ratings, reviews, custom properties), `offer(options)`, `review(options)`, `aggregateRating(options)`

**Content** — `article(options)`, `blogPosting(options)`, `newsArticle(options)`, `recipe(options)`, `videoObject(options)`, `imageObject(options)`

**Entities** — `person(options)`, `organization(options)`

**Site structure** — `webSite(options)` (with search action), `webPage(options)`, `profilePage(options)`, `breadcrumb(items)`, `faq(items)`, `howTo(options)`, `collectionPage(options)`

**Local / business / careers / learning** — `event(options)`, `localBusiness(options)`, `jobPosting(options)`, `softwareApplication(options)`, `course(options)`, `service(options)`

**Directories** — `itemList(options)`

**Food** — `menu(options)`, `menuSection(options)`, `menuItem(options)`

**Property** — `realEstateListing(options)`, `accommodation(options)`

**Music** — `musicGroup(options)`, `musicAlbum(options)`, `musicRecording(options)`

**Graph** — `buildGraph(nodes, options?)`

## One graph, not a pile

Emitting several builders side by side is legal, but it describes several
*unrelated* things — nothing says the Article was published by the
Organization, or that the WebPage belongs to the WebSite. `buildGraph()` gives
each node a stable `@id` and wires the references between them:

```js
import { buildGraph, webSite, organization, webPage, article } from '@arraypress/jsonld';

const ld = buildGraph([
  webSite({ name: 'Acme', url: 'https://acme.com' }),
  organization({ name: 'Acme Inc', url: 'https://acme.com' }),
  webPage({ name: 'Hello', url: 'https://acme.com/hello' }),
  article({ headline: 'Hello', url: 'https://acme.com/hello' }),
]);
// WebPage.isPartOf   -> https://acme.com#website
// Article.publisher  -> https://acme.com#organization
// Article.mainEntityOfPage -> https://acme.com/hello#webpage
```

Site entities (WebSite, Organization, Person) are keyed on the **origin**, so
every page in a crawl references the same node. Everything else is keyed on the
**page URL**. A per-page Organization is, to a crawler, a different
Organization on every page — that split is the whole trick.

Inferred links are only applied when both nodes are present, and never over a
value you set yourself. `about` is set on the homepage only.

## Directory sites

One `localBusiness()` serves every vertical: pass `type` to narrow it to any
Schema.org LocalBusiness subtype. Google treats the subtype as a LocalBusiness
for rich results and uses it to understand the vertical, so a narrower type is
always better than the bare default.

```js
localBusiness({
  type: 'Dentist',                    // or Restaurant, AutoRepair, HairSalon, MusicVenue…
  name: 'Bristol Smile Clinic',
  address: { streetAddress: '12 Park St', addressLocality: 'Bristol', postalCode: 'BS1 5JA' },
  phone: '+44 117 000 0000',
  openingHours: [
    { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], opens: '09:00', closes: '17:30' },
    { days: 'Sat', opens: '09:00', closes: '13:00' },
    { days: 'Sun', closed: true },
  ],
});
```

Day names accept `'Mon'`, `'monday'` or `'Monday'`. A day marked `closed` is
emitted as `00:00`–`00:00`, which is Google's convention — leaving a day out
says "unknown", which is a different claim.

The `type` option is a checked union covering the whole tree — automotive,
medical, food, health and beauty, trades, professional, entertainment, sport,
lodging and retail. See `LocalBusinessType` in the type definitions.
`organization()`, `event()` and `accommodation()` take the same treatment via
`OrganizationType`, `EventType` and `AccommodationType`.

### Listing pages

`itemList()` is what makes "Dentists in Bristol" eligible for a carousel rather
than a single link. It composes with the other builders — pass whole nodes in
and the nesting is handled:

```js
itemList({
  name: 'Dentists in Bristol',
  url: 'https://example.com/bristol/dentists',
  items: practices.map((p) => localBusiness({ type: 'Dentist', ...p })),
  startPosition: 41,      // page 3 of an archive — don't restart at 1
  totalItems: 220,
});
```

Every builder accepts an **`extra`** field (merged last) for any Schema.org property it doesn't model — declare the common 90%, bolt on the long tail. `extra` can also override `@type` for a subtype no union covers yet. See `src/index.d.ts` for full option details.

## Using it with `@arraypress/seo`

The builders return plain objects; `seo` serialises them into the page. The two
know nothing about each other — `seo` just takes a `jsonLd` array — so you can
build nodes anywhere: in a page's frontmatter, in a shared util, or in a build
script that writes them out.

```astro
---
import { SEO } from '@arraypress/seo-astro';
import { organization, breadcrumb } from '@arraypress/jsonld';

const ld = [
  organization({ name: 'Acme', url: Astro.site.href }),
  breadcrumb([{ name: 'Home', item: '/' }, { name: 'Dentists' }]),
];
---
<SEO title="Dentists in Bristol" jsonLd={ld} />
```

## Validation

`npm test` runs the behavioural suite; `npm run validate` type-checks a sample
of every builder's output against **`schema-dts`** — the TypeScript types
generated from the Schema.org vocabulary itself — so an invalid property fails
the build rather than shipping. That check has already caught real bugs: it
rejected an `address` on `RealEstateListing`, which descends from `WebPage` and
has no such property (it belongs on the nested `Accommodation`).

Bear in mind Google's requirements are **stricter than Schema.org's**.
Schema.org marks nearly everything optional; Google silently drops a rich
result when a required property is missing. Validating the shape is necessary
but not sufficient — check new types against the Rich Results Test too.

## License

MIT
