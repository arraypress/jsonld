/**
 * @arraypress/jsonld
 *
 * JSON-LD structured data builders for SEO. Product, Article, Organization,
 * WebSite, Breadcrumb, FAQ, HowTo, and more.
 *
 * Zero dependencies. Works everywhere.
 *
 * @module @arraypress/jsonld
 */

const CONTEXT = 'https://schema.org';

/**
 * Build a Product JSON-LD object.
 *
 * @param {Object} options - Product data.
 * @param {string} options.name - Product name.
 * @param {string} options.url - Product page URL.
 * @param {string} [options.description] - Product description.
 * @param {string} [options.image] - Product image URL.
 * @param {string} [options.sku] - Product SKU.
 * @param {string} [options.brand] - Brand name (wrapped as Organization).
 * @param {number|string} [options.price] - Offer price.
 * @param {string} [options.currency] - ISO 4217 currency code (e.g. 'USD').
 * @param {string} [options.availability] - Schema.org availability URL. Defaults to InStock when price is set.
 * @param {number} [options.rating] - Aggregate rating value.
 * @param {number} [options.reviewCount] - Number of reviews.
 * @returns {Object} A JSON-LD Product object.
 *
 * @example
 * const ld = product({
 *   name: 'Widget Pro',
 *   url: 'https://example.com/widget-pro',
 *   price: 29.99,
 *   currency: 'USD',
 *   brand: 'Acme',
 * });
 */
export function product({ name, url, description, image, sku, brand, price, currency, availability, rating, reviewCount }) {
  const ld = { '@context': CONTEXT, '@type': 'Product', name, url };
  if (description) ld.description = description;
  if (image) ld.image = image;
  if (sku) ld.sku = sku;
  if (brand) ld.brand = { '@type': 'Organization', name: brand };
  if (price !== undefined && currency) {
    ld.offers = { '@type': 'Offer', url, priceCurrency: currency.toUpperCase(), price: String(price), availability: availability || 'https://schema.org/InStock' };
  }
  if (rating && reviewCount) {
    ld.aggregateRating = { '@type': 'AggregateRating', ratingValue: rating, reviewCount };
  }
  return ld;
}

/**
 * Build an Article JSON-LD object.
 *
 * @param {Object} options - Article data.
 * @param {string} options.headline - Article headline.
 * @param {string} options.url - Article URL.
 * @param {string} [options.description] - Article description.
 * @param {string} [options.image] - Article image URL.
 * @param {string} [options.datePublished] - ISO 8601 publication date.
 * @param {string} [options.dateModified] - ISO 8601 last modified date.
 * @param {string|Object} [options.author] - Author name (string) or Person/Organization object.
 * @param {string|Object} [options.publisher] - Publisher name (string) or Organization object.
 * @returns {Object} A JSON-LD Article object.
 *
 * @example
 * const ld = article({
 *   headline: 'Getting Started with Widgets',
 *   url: 'https://example.com/blog/getting-started',
 *   author: 'Jane Doe',
 *   datePublished: '2025-01-15',
 * });
 */
export function article({ headline, url, description, image, datePublished, dateModified, author, publisher }) {
  const ld = { '@context': CONTEXT, '@type': 'Article', headline, url };
  if (description) ld.description = description;
  if (image) ld.image = image;
  if (datePublished) ld.datePublished = datePublished;
  if (dateModified) ld.dateModified = dateModified;
  if (author) ld.author = typeof author === 'string' ? { '@type': 'Person', name: author } : author;
  if (publisher) ld.publisher = typeof publisher === 'string' ? { '@type': 'Organization', name: publisher } : publisher;
  return ld;
}

/**
 * Build a BlogPosting JSON-LD object.
 *
 * Identical to {@link article} but with `@type` set to `BlogPosting`.
 *
 * @param {Object} opts - Same options as {@link article}.
 * @returns {Object} A JSON-LD BlogPosting object.
 *
 * @example
 * const ld = blogPosting({
 *   headline: 'Our New Release',
 *   url: 'https://example.com/blog/new-release',
 *   author: 'Jane Doe',
 * });
 */
export function blogPosting(opts) {
  return { ...article(opts), '@type': 'BlogPosting' };
}

/**
 * Build an Organization JSON-LD object.
 *
 * @param {Object} options - Organization data.
 * @param {string} options.name - Organization name.
 * @param {string} options.url - Organization website URL.
 * @param {string} [options.logo] - Logo image URL.
 * @param {string} [options.description] - Organization description.
 * @param {string[]} [options.sameAs] - Social profile URLs (e.g. Twitter, LinkedIn).
 * @returns {Object} A JSON-LD Organization object.
 *
 * @example
 * const ld = organization({
 *   name: 'Acme Inc.',
 *   url: 'https://acme.com',
 *   logo: 'https://acme.com/logo.png',
 *   sameAs: ['https://twitter.com/acme'],
 * });
 */
export function organization({ name, url, logo, description, sameAs }) {
  const ld = { '@context': CONTEXT, '@type': 'Organization', name, url };
  if (logo) ld.logo = logo;
  if (description) ld.description = description;
  if (sameAs && sameAs.length) ld.sameAs = sameAs;
  return ld;
}

/**
 * Build a WebSite JSON-LD object with optional SearchAction.
 *
 * @param {Object} options - WebSite data.
 * @param {string} options.name - Site name.
 * @param {string} options.url - Site URL.
 * @param {string} [options.searchUrl] - Search URL template (must contain `{search_term_string}`).
 * @returns {Object} A JSON-LD WebSite object.
 *
 * @example
 * const ld = webSite({
 *   name: 'Acme Store',
 *   url: 'https://acme.com',
 *   searchUrl: 'https://acme.com/search?q={search_term_string}',
 * });
 */
export function webSite({ name, url, searchUrl }) {
  const ld = { '@context': CONTEXT, '@type': 'WebSite', name, url };
  if (searchUrl) {
    ld.potentialAction = { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: searchUrl }, 'query-input': 'required name=search_term_string' };
  }
  return ld;
}

/**
 * Build a BreadcrumbList JSON-LD object.
 *
 * @param {Array<{name: string, url?: string}>} items - Breadcrumb items in order. The last item typically has no URL.
 * @returns {Object} A JSON-LD BreadcrumbList object.
 *
 * @example
 * const ld = breadcrumb([
 *   { name: 'Home', url: 'https://example.com' },
 *   { name: 'Products', url: 'https://example.com/products' },
 *   { name: 'Widget Pro' },
 * ]);
 */
export function breadcrumb(items) {
  return {
    '@context': CONTEXT, '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem', position: i + 1, name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

/**
 * Build an FAQPage JSON-LD object.
 *
 * @param {Array<{question: string, answer: string}>} items - Question/answer pairs.
 * @returns {Object} A JSON-LD FAQPage object.
 *
 * @example
 * const ld = faq([
 *   { question: 'What is your return policy?', answer: '30-day money-back guarantee.' },
 *   { question: 'Do you offer support?', answer: 'Yes, 24/7 email support.' },
 * ]);
 */
export function faq(items) {
  return {
    '@context': CONTEXT, '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question', name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

/**
 * Build a HowTo JSON-LD object.
 *
 * @param {Object} options - HowTo data.
 * @param {string} options.name - Title of the how-to guide.
 * @param {string} [options.description] - Description of the how-to.
 * @param {Array<{name: string, text: string, url?: string, image?: string}>} [options.steps] - Ordered steps.
 * @param {string} [options.totalTime] - ISO 8601 duration (e.g. 'PT30M').
 * @returns {Object} A JSON-LD HowTo object.
 *
 * @example
 * const ld = howTo({
 *   name: 'How to Install Widget Pro',
 *   totalTime: 'PT5M',
 *   steps: [
 *     { name: 'Download', text: 'Download the installer from your account.' },
 *     { name: 'Run', text: 'Double-click the installer and follow the prompts.' },
 *   ],
 * });
 */
export function howTo({ name, description, steps, totalTime }) {
  const ld = { '@context': CONTEXT, '@type': 'HowTo', name };
  if (description) ld.description = description;
  if (totalTime) ld.totalTime = totalTime;
  if (steps) ld.step = steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text, ...(s.url ? { url: s.url } : {}), ...(s.image ? { image: s.image } : {}) }));
  return ld;
}

/**
 * Build an Event JSON-LD object.
 *
 * @param {Object} options - Event data.
 * @param {string} options.name - Event name.
 * @param {string} options.startDate - ISO 8601 start date.
 * @param {string} [options.url] - Event page URL.
 * @param {string} [options.endDate] - ISO 8601 end date.
 * @param {string|Object} [options.location] - Venue name (string) or Place object.
 * @param {string} [options.description] - Event description.
 * @param {string} [options.image] - Event image URL.
 * @param {string|Object} [options.organizer] - Organizer name (string) or Organization object.
 * @returns {Object} A JSON-LD Event object.
 *
 * @example
 * const ld = event({
 *   name: 'Product Launch',
 *   startDate: '2025-06-01T18:00:00Z',
 *   location: 'Convention Center',
 *   organizer: 'Acme Inc.',
 * });
 */
export function event({ name, url, startDate, endDate, location, description, image, organizer }) {
  const ld = { '@context': CONTEXT, '@type': 'Event', name, startDate };
  if (url) ld.url = url;
  if (endDate) ld.endDate = endDate;
  if (description) ld.description = description;
  if (image) ld.image = image;
  if (location) ld.location = typeof location === 'string' ? { '@type': 'Place', name: location } : location;
  if (organizer) ld.organizer = typeof organizer === 'string' ? { '@type': 'Organization', name: organizer } : organizer;
  return ld;
}

/**
 * Build a LocalBusiness JSON-LD object.
 *
 * @param {Object} options - Business data.
 * @param {string} options.name - Business name.
 * @param {string} [options.url] - Business website URL.
 * @param {string|Object} [options.address] - Street address string or PostalAddress fields.
 * @param {string} [options.phone] - Telephone number.
 * @param {string} [options.image] - Business image URL.
 * @param {string} [options.priceRange] - Price range indicator (e.g. '$$').
 * @param {number} [options.rating] - Aggregate rating value.
 * @param {number} [options.reviewCount] - Number of reviews.
 * @param {Object} [options.geo] - Geographic coordinates (`{ latitude, longitude }`).
 * @returns {Object} A JSON-LD LocalBusiness object.
 *
 * @example
 * const ld = localBusiness({
 *   name: 'Acme Coffee',
 *   url: 'https://acmecoffee.com',
 *   address: { streetAddress: '123 Main St', addressLocality: 'Springfield' },
 *   phone: '+1-555-0100',
 *   priceRange: '$$',
 * });
 */
export function localBusiness({ name, url, address, phone, image, priceRange, rating, reviewCount, geo }) {
  const ld = { '@context': CONTEXT, '@type': 'LocalBusiness', name };
  if (url) ld.url = url;
  if (image) ld.image = image;
  if (phone) ld.telephone = phone;
  if (priceRange) ld.priceRange = priceRange;
  if (address) ld.address = typeof address === 'string' ? { '@type': 'PostalAddress', streetAddress: address } : { '@type': 'PostalAddress', ...address };
  if (geo) ld.geo = { '@type': 'GeoCoordinates', ...geo };
  if (rating && reviewCount) ld.aggregateRating = { '@type': 'AggregateRating', ratingValue: rating, reviewCount };
  return ld;
}

/**
 * Build a SoftwareApplication JSON-LD object.
 *
 * @param {Object} options - Application data.
 * @param {string} options.name - Application name.
 * @param {string} [options.url] - Application page URL.
 * @param {string} [options.description] - Application description.
 * @param {string} [options.operatingSystem] - Supported OS (e.g. 'Windows 10', 'macOS').
 * @param {string} [options.category] - Application category (e.g. 'DeveloperApplication').
 * @param {number|string} [options.price] - Offer price.
 * @param {string} [options.currency] - ISO 4217 currency code.
 * @param {number} [options.rating] - Aggregate rating value.
 * @param {number} [options.reviewCount] - Number of reviews.
 * @returns {Object} A JSON-LD SoftwareApplication object.
 *
 * @example
 * const ld = softwareApplication({
 *   name: 'Widget Editor',
 *   url: 'https://example.com/widget-editor',
 *   price: 49,
 *   currency: 'USD',
 *   category: 'DeveloperApplication',
 * });
 */
export function softwareApplication({ name, url, description, operatingSystem, category, price, currency, rating, reviewCount }) {
  const ld = { '@context': CONTEXT, '@type': 'SoftwareApplication', name };
  if (url) ld.url = url;
  if (description) ld.description = description;
  if (operatingSystem) ld.operatingSystem = operatingSystem;
  if (category) ld.applicationCategory = category;
  if (price !== undefined && currency) ld.offers = { '@type': 'Offer', price: String(price), priceCurrency: currency.toUpperCase() };
  if (rating && reviewCount) ld.aggregateRating = { '@type': 'AggregateRating', ratingValue: rating, reviewCount };
  return ld;
}

/**
 * Build a CollectionPage JSON-LD object.
 *
 * @param {Object} options - Collection page data.
 * @param {string} options.name - Collection name.
 * @param {string} options.url - Collection page URL.
 * @param {string} [options.description] - Collection description.
 * @param {string|Object} [options.provider] - Provider name (string) or Organization object.
 * @returns {Object} A JSON-LD CollectionPage object.
 *
 * @example
 * const ld = collectionPage({
 *   name: 'Premium Widgets',
 *   url: 'https://example.com/collections/premium',
 *   description: 'Our top-tier widget collection.',
 *   provider: 'Acme Inc.',
 * });
 */
export function collectionPage({ name, url, description, provider }) {
  const ld = { '@context': CONTEXT, '@type': 'CollectionPage', name, url };
  if (description) ld.description = description;
  if (provider) ld.provider = typeof provider === 'string' ? { '@type': 'Organization', name: provider } : provider;
  return ld;
}
