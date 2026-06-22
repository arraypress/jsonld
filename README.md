# @arraypress/jsonld

JSON-LD structured data builders for SEO. Product, Article, Organization, WebSite, Breadcrumb, FAQ, HowTo, and more. Zero dependencies.

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

Every builder accepts an **`extra`** field (merged last) for any Schema.org property it doesn't model — declare the common 90%, bolt on the long tail. See `src/index.d.ts` for full option details.

## License

MIT
