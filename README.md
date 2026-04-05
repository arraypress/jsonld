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

- `product(options)` - Product with offers and ratings
- `article(options)` - Article schema
- `blogPosting(options)` - BlogPosting (same options as article)
- `organization(options)` - Organization schema
- `webSite(options)` - WebSite with optional search action
- `breadcrumb(items)` - BreadcrumbList from `{ name, url? }` items
- `faq(items)` - FAQPage from `{ question, answer }` items
- `howTo(options)` - HowTo with steps
- `event(options)` - Event schema
- `localBusiness(options)` - LocalBusiness with address, geo, ratings
- `softwareApplication(options)` - SoftwareApplication schema
- `collectionPage(options)` - CollectionPage schema

See type definitions in `src/index.d.ts` for full option details.

## License

MIT
