/**
 * @arraypress/jsonld
 *
 * JSON-LD structured data builders for SEO — the common Schema.org types used
 * by content, commerce, profile, local, and careers sites: Product, Article,
 * BlogPosting, NewsArticle, Person, Organization, WebSite, WebPage, ProfilePage,
 * Breadcrumb, FAQ, HowTo, Event, JobPosting, LocalBusiness, SoftwareApplication,
 * Course, Recipe, VideoObject, ImageObject, Service, Review, AggregateRating,
 * Offer, and CollectionPage.
 *
 * Every builder returns a complete object with `@context`. Each accepts an
 * `extra` escape hatch (merged last) for any Schema.org field it doesn't model,
 * so you can declare the common 90% and bolt on the long tail.
 *
 * Zero dependencies. Works everywhere.
 *
 * @module @arraypress/jsonld
 */

const CONTEXT = 'https://schema.org';

/* Merge caller-supplied `extra` Schema.org fields last — the escape hatch for
 * properties a builder doesn't model. Avoid overriding `@type` unless intended. */
const withExtra = (ld, extra) => (extra ? { ...ld, ...extra } : ld);

/* ── Internal node helpers (no @context — for nesting inside other nodes) ── */

const personNode = (p) =>
  typeof p === 'string'
    ? { '@type': 'Person', name: p }
    : { '@type': 'Person', ...p };

const orgNode = (o) =>
  typeof o === 'string'
    ? { '@type': 'Organization', name: o }
    : { '@type': 'Organization', ...o };

const addressNode = (a) =>
  typeof a === 'string'
    ? { '@type': 'PostalAddress', streetAddress: a }
    : { '@type': 'PostalAddress', ...a };

function offerNode({ price, currency, url, availability, priceValidUntil }) {
  const node = { '@type': 'Offer' };
  if (url) node.url = url;
  if (price !== undefined) node.price = String(price);
  if (currency) node.priceCurrency = currency.toUpperCase();
  node.availability = availability || 'https://schema.org/InStock';
  if (priceValidUntil) node.priceValidUntil = priceValidUntil;
  return node;
}

function aggregateRatingNode({ rating, reviewCount, bestRating = 5 }) {
  return { '@type': 'AggregateRating', ratingValue: rating, reviewCount, bestRating };
}

function reviewNode({ rating, author, body, datePublished, bestRating = 5 }) {
  const node = { '@type': 'Review', reviewRating: { '@type': 'Rating', ratingValue: rating, bestRating } };
  if (author) node.author = personNode(author);
  if (body) node.reviewBody = body;
  if (datePublished) node.datePublished = datePublished;
  return node;
}

// ── Commerce ────────────────────────────────

/**
 * Build a Product JSON-LD object.
 *
 * @param {Object} options - Product data.
 * @param {string} options.name - Product name.
 * @param {string} options.url - Product page URL.
 * @param {string} [options.description] - Product description.
 * @param {string|string[]} [options.image] - Product image URL(s).
 * @param {string} [options.sku] - Product SKU.
 * @param {string|Object} [options.brand] - Brand name (string → Brand) or a node.
 * @param {number|string} [options.price] - Offer price.
 * @param {string} [options.currency] - ISO 4217 currency code (e.g. 'USD').
 * @param {string} [options.availability] - Schema.org availability URL. Defaults to InStock when price is set.
 * @param {string} [options.priceValidUntil] - ISO 8601 date the price is valid until.
 * @param {number} [options.rating] - Aggregate rating value.
 * @param {number} [options.reviewCount] - Number of reviews.
 * @param {Array<{rating: number, author?: string|Object, body?: string, datePublished?: string}>} [options.reviews] - Individual reviews.
 * @param {Array<{name: string, value: string|number}>} [options.additionalProperty] - Custom spec key/values (PropertyValue).
 * @param {Object} [options.extra] - Extra Schema.org fields, merged last.
 * @returns {Object} A JSON-LD Product object.
 *
 * @example
 * const ld = product({
 *   name: 'Lush Pads Vol. 2', url: 'https://example.com/lush-pads',
 *   price: 29, currency: 'USD', brand: 'Spindrift Co',
 *   rating: 4.8, reviewCount: 64,
 *   additionalProperty: [{ name: 'Format', value: 'WAV' }],
 *   reviews: [{ rating: 5, author: 'Jane', body: 'Gorgeous.' }],
 * });
 */
export function product({ name, url, description, image, sku, brand, price, currency, availability, priceValidUntil, rating, reviewCount, reviews, additionalProperty, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'Product', name, url };
  if (description) ld.description = description;
  if (image) ld.image = image;
  if (sku) ld.sku = sku;
  if (brand) ld.brand = typeof brand === 'string' ? { '@type': 'Organization', name: brand } : brand;
  if (price !== undefined && currency) ld.offers = offerNode({ price, currency, url, availability, priceValidUntil });
  if (rating && reviewCount) ld.aggregateRating = aggregateRatingNode({ rating, reviewCount });
  if (additionalProperty && additionalProperty.length) {
    ld.additionalProperty = additionalProperty.map((p) => ({ '@type': 'PropertyValue', name: p.name, value: p.value }));
  }
  if (reviews && reviews.length) ld.review = reviews.map(reviewNode);
  return withExtra(ld, extra);
}

/**
 * Build a standalone Offer JSON-LD object.
 *
 * @param {Object} options - Offer data (`price`, `currency`, `url?`, `availability?`, `priceValidUntil?`).
 * @returns {Object} A JSON-LD Offer object.
 */
export function offer({ price, currency, url, availability, priceValidUntil, extra }) {
  return withExtra({ '@context': CONTEXT, ...offerNode({ price, currency, url, availability, priceValidUntil }) }, extra);
}

/**
 * Build a standalone Review JSON-LD object.
 *
 * @param {Object} options - `rating`, `author?`, `body?`, `datePublished?`, `bestRating?`.
 * @returns {Object} A JSON-LD Review object.
 */
export function review({ rating, author, body, datePublished, bestRating, extra }) {
  return withExtra({ '@context': CONTEXT, ...reviewNode({ rating, author, body, datePublished, bestRating }) }, extra);
}

/**
 * Build a standalone AggregateRating JSON-LD object.
 *
 * @param {Object} options - `rating`, `reviewCount`, `bestRating?`.
 * @returns {Object} A JSON-LD AggregateRating object.
 */
export function aggregateRating({ rating, reviewCount, bestRating, extra }) {
  return withExtra({ '@context': CONTEXT, ...aggregateRatingNode({ rating, reviewCount, bestRating }) }, extra);
}

// ── Content ─────────────────────────────────

/**
 * Build an Article JSON-LD object.
 *
 * @param {Object} options - Article data.
 * @param {string} options.headline - Article headline.
 * @param {string} options.url - Article URL.
 * @param {string} [options.description] - Article description.
 * @param {string|string[]} [options.image] - Article image URL(s).
 * @param {string} [options.datePublished] - ISO 8601 publication date.
 * @param {string} [options.dateModified] - ISO 8601 last modified date.
 * @param {string|Object} [options.author] - Author name or Person/Organization node.
 * @param {string|Object} [options.publisher] - Publisher name or Organization node.
 * @param {string} [options.section] - Article section.
 * @param {string[]} [options.keywords] - Keywords/tags.
 * @param {Object} [options.extra] - Extra Schema.org fields, merged last.
 * @returns {Object} A JSON-LD Article object.
 *
 * @example
 * const ld = article({ headline: 'Getting Started', url: 'https://example.com/x', author: 'Jane Doe', datePublished: '2026-01-15' });
 */
export function article({ headline, url, description, image, datePublished, dateModified, author, publisher, section, keywords, extra }, _type = 'Article') {
  const ld = { '@context': CONTEXT, '@type': _type, headline, url };
  if (description) ld.description = description;
  if (image) ld.image = image;
  if (datePublished) ld.datePublished = datePublished;
  if (dateModified) ld.dateModified = dateModified;
  if (author) ld.author = personNode(author);
  if (publisher) ld.publisher = orgNode(publisher);
  if (section) ld.articleSection = section;
  if (keywords && keywords.length) ld.keywords = keywords.join(', ');
  return withExtra(ld, extra);
}

/**
 * Build a BlogPosting JSON-LD object. Same options as {@link article}.
 * @returns {Object} A JSON-LD BlogPosting object.
 */
export function blogPosting(opts) {
  return article(opts, 'BlogPosting');
}

/**
 * Build a NewsArticle JSON-LD object. Same options as {@link article}.
 * @returns {Object} A JSON-LD NewsArticle object.
 */
export function newsArticle(opts) {
  return article(opts, 'NewsArticle');
}

/**
 * Build a Recipe JSON-LD object.
 *
 * @param {Object} options - Recipe data.
 * @param {string} options.name - Recipe name.
 * @param {string|string[]} [options.image] - Image URL(s).
 * @param {string|Object} [options.author] - Author name or Person node.
 * @param {string} [options.description] - Description.
 * @param {string} [options.datePublished] - ISO 8601 date.
 * @param {string[]} [options.ingredients] - Ingredient lines (recipeIngredient).
 * @param {string[]} [options.instructions] - Step texts (HowToStep).
 * @param {string} [options.prepTime] - ISO 8601 duration (e.g. 'PT15M').
 * @param {string} [options.cookTime] - ISO 8601 duration.
 * @param {string} [options.totalTime] - ISO 8601 duration.
 * @param {string} [options.recipeYield] - Yield (e.g. '4 servings').
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD Recipe object.
 */
export function recipe({ name, image, author, description, datePublished, ingredients, instructions, prepTime, cookTime, totalTime, recipeYield, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'Recipe', name };
  if (image) ld.image = image;
  if (author) ld.author = personNode(author);
  if (description) ld.description = description;
  if (datePublished) ld.datePublished = datePublished;
  if (prepTime) ld.prepTime = prepTime;
  if (cookTime) ld.cookTime = cookTime;
  if (totalTime) ld.totalTime = totalTime;
  if (recipeYield) ld.recipeYield = recipeYield;
  if (ingredients && ingredients.length) ld.recipeIngredient = ingredients;
  if (instructions && instructions.length) ld.recipeInstructions = instructions.map((text) => ({ '@type': 'HowToStep', text }));
  return withExtra(ld, extra);
}

/**
 * Build a VideoObject JSON-LD object.
 *
 * @param {Object} options - Video data.
 * @param {string} options.name - Video title.
 * @param {string} options.description - Description.
 * @param {string} options.thumbnailUrl - Thumbnail image URL.
 * @param {string} options.uploadDate - ISO 8601 upload date.
 * @param {string} [options.contentUrl] - Direct video file URL.
 * @param {string} [options.embedUrl] - Player embed URL.
 * @param {string} [options.duration] - ISO 8601 duration (e.g. 'PT2M30S').
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD VideoObject object.
 */
export function videoObject({ name, description, thumbnailUrl, uploadDate, contentUrl, embedUrl, duration, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'VideoObject', name, description, thumbnailUrl, uploadDate };
  if (contentUrl) ld.contentUrl = contentUrl;
  if (embedUrl) ld.embedUrl = embedUrl;
  if (duration) ld.duration = duration;
  return withExtra(ld, extra);
}

/**
 * Build an ImageObject JSON-LD object.
 *
 * @param {Object} options - `url`, `width?`, `height?`, `caption?`.
 * @returns {Object} A JSON-LD ImageObject object.
 */
export function imageObject({ url, width, height, caption, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'ImageObject', url };
  if (width) ld.width = width;
  if (height) ld.height = height;
  if (caption) ld.caption = caption;
  return withExtra(ld, extra);
}

// ── Entities ────────────────────────────────

/**
 * Build a Person JSON-LD object — profiles, authors, team members.
 *
 * @param {Object} options - Person data.
 * @param {string} options.name - Full name.
 * @param {string} [options.url] - Profile / website URL.
 * @param {string} [options.image] - Avatar URL.
 * @param {string} [options.jobTitle] - Job title.
 * @param {string} [options.description] - Short bio.
 * @param {string} [options.email] - Email address.
 * @param {string|Object} [options.worksFor] - Employer name or Organization node.
 * @param {string[]} [options.sameAs] - Social / profile URLs.
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD Person object.
 *
 * @example
 * const ld = person({ name: 'Jane Doe', url: 'https://jane.dev', jobTitle: 'Designer', sameAs: ['https://x.com/jane'] });
 */
export function person({ name, url, image, jobTitle, description, email, worksFor, sameAs, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'Person', name };
  if (url) ld.url = url;
  if (image) ld.image = image;
  if (jobTitle) ld.jobTitle = jobTitle;
  if (description) ld.description = description;
  if (email) ld.email = email;
  if (worksFor) ld.worksFor = orgNode(worksFor);
  if (sameAs && sameAs.length) ld.sameAs = sameAs;
  return withExtra(ld, extra);
}

/**
 * Build an Organization JSON-LD object.
 *
 * @param {Object} options - `name`, `url`, `logo?`, `description?`, `sameAs?`.
 * @returns {Object} A JSON-LD Organization object.
 */
export function organization({ name, url, logo, description, sameAs, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'Organization', name, url };
  if (logo) ld.logo = logo;
  if (description) ld.description = description;
  if (sameAs && sameAs.length) ld.sameAs = sameAs;
  return withExtra(ld, extra);
}

// ── Site structure ──────────────────────────

/**
 * Build a WebSite JSON-LD object with optional SearchAction.
 *
 * @param {Object} options - `name`, `url`, `searchUrl?` (must contain `{search_term_string}`).
 * @returns {Object} A JSON-LD WebSite object.
 */
export function webSite({ name, url, searchUrl, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'WebSite', name, url };
  if (searchUrl) {
    ld.potentialAction = { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: searchUrl }, 'query-input': 'required name=search_term_string' };
  }
  return withExtra(ld, extra);
}

/**
 * Build a WebPage JSON-LD object — a generic page.
 *
 * @param {Object} options - `name`, `url`, `description?`, `primaryImage?`, `datePublished?`, `dateModified?`.
 * @returns {Object} A JSON-LD WebPage object.
 */
export function webPage({ name, url, description, primaryImage, datePublished, dateModified, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'WebPage', name, url };
  if (description) ld.description = description;
  if (primaryImage) ld.primaryImageOfPage = { '@type': 'ImageObject', url: primaryImage };
  if (datePublished) ld.datePublished = datePublished;
  if (dateModified) ld.dateModified = dateModified;
  return withExtra(ld, extra);
}

/**
 * Build a ProfilePage JSON-LD object — wraps a Person (or Organization) for
 * the profile-page rich result.
 *
 * @param {Object} options - `mainEntity` (Person/Org options or node), `url?`, `dateCreated?`, `dateModified?`.
 * @returns {Object} A JSON-LD ProfilePage object.
 */
export function profilePage({ mainEntity, url, dateCreated, dateModified, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'ProfilePage' };
  if (url) ld.url = url;
  if (dateCreated) ld.dateCreated = dateCreated;
  if (dateModified) ld.dateModified = dateModified;
  if (mainEntity) ld.mainEntity = mainEntity['@type'] ? mainEntity : personNode(mainEntity);
  return withExtra(ld, extra);
}

/**
 * Build a BreadcrumbList JSON-LD object.
 *
 * @param {Array<{name: string, url?: string}>} items - Items in order (last typically has no URL).
 * @returns {Object} A JSON-LD BreadcrumbList object.
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
 * @param {Object} options - `name`, `description?`, `steps?` (`{name,text,url?,image?}[]`), `totalTime?`.
 * @returns {Object} A JSON-LD HowTo object.
 */
export function howTo({ name, description, steps, totalTime, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'HowTo', name };
  if (description) ld.description = description;
  if (totalTime) ld.totalTime = totalTime;
  if (steps) ld.step = steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text, ...(s.url ? { url: s.url } : {}), ...(s.image ? { image: s.image } : {}) }));
  return withExtra(ld, extra);
}

/**
 * Build a CollectionPage JSON-LD object.
 *
 * @param {Object} options - `name`, `url`, `description?`, `provider?`.
 * @returns {Object} A JSON-LD CollectionPage object.
 */
export function collectionPage({ name, url, description, provider, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'CollectionPage', name, url };
  if (description) ld.description = description;
  if (provider) ld.provider = orgNode(provider);
  return withExtra(ld, extra);
}

// ── Local / business / careers / learning ──

/**
 * Build an Event JSON-LD object.
 *
 * @param {Object} options - `name`, `startDate`, `url?`, `endDate?`, `location?`, `description?`, `image?`, `organizer?`.
 * @returns {Object} A JSON-LD Event object.
 */
export function event({ name, url, startDate, endDate, location, description, image, organizer, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'Event', name, startDate };
  if (url) ld.url = url;
  if (endDate) ld.endDate = endDate;
  if (description) ld.description = description;
  if (image) ld.image = image;
  if (location) ld.location = typeof location === 'string' ? { '@type': 'Place', name: location } : location;
  if (organizer) ld.organizer = orgNode(organizer);
  return withExtra(ld, extra);
}

/**
 * Build a LocalBusiness JSON-LD object.
 *
 * @param {Object} options - `name`, `url?`, `address?`, `phone?`, `image?`, `priceRange?`, `rating?`, `reviewCount?`, `geo?`.
 * @returns {Object} A JSON-LD LocalBusiness object.
 */
export function localBusiness({ name, url, address, phone, image, priceRange, rating, reviewCount, geo, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'LocalBusiness', name };
  if (url) ld.url = url;
  if (image) ld.image = image;
  if (phone) ld.telephone = phone;
  if (priceRange) ld.priceRange = priceRange;
  if (address) ld.address = addressNode(address);
  if (geo) ld.geo = { '@type': 'GeoCoordinates', ...geo };
  if (rating && reviewCount) ld.aggregateRating = aggregateRatingNode({ rating, reviewCount });
  return withExtra(ld, extra);
}

/**
 * Build a JobPosting JSON-LD object — careers / jobs pages.
 *
 * @param {Object} options - Job data.
 * @param {string} options.title - Job title.
 * @param {string} options.description - Full description (HTML allowed).
 * @param {string} options.datePosted - ISO 8601 date posted.
 * @param {string|Object} options.hiringOrganization - Employer name or Organization node.
 * @param {string} [options.url] - Posting URL.
 * @param {string} [options.validThrough] - ISO 8601 expiry date.
 * @param {string} [options.employmentType] - e.g. 'FULL_TIME', 'CONTRACT'.
 * @param {string|Object} [options.jobLocation] - Locality string or PostalAddress fields.
 * @param {boolean} [options.remote] - Remote role → jobLocationType TELECOMMUTE.
 * @param {number|string} [options.salary] - Base salary value.
 * @param {string} [options.currency] - ISO 4217 currency for the salary.
 * @param {string} [options.salaryUnit] - Salary unit ('YEAR' default, 'HOUR', 'MONTH'…).
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD JobPosting object.
 *
 * @example
 * const ld = jobPosting({ title: 'Senior Engineer', description: '…', datePosted: '2026-06-01',
 *   hiringOrganization: 'Acme', jobLocation: 'Remote', employmentType: 'FULL_TIME', remote: true });
 */
export function jobPosting({ title, description, datePosted, hiringOrganization, url, validThrough, employmentType, jobLocation, remote, salary, currency, salaryUnit = 'YEAR', extra }) {
  const ld = { '@context': CONTEXT, '@type': 'JobPosting', title, description, datePosted };
  if (url) ld.url = url;
  if (validThrough) ld.validThrough = validThrough;
  if (employmentType) ld.employmentType = employmentType;
  if (hiringOrganization) ld.hiringOrganization = orgNode(hiringOrganization);
  if (jobLocation) ld.jobLocation = { '@type': 'Place', address: addressNode(typeof jobLocation === 'string' ? { addressLocality: jobLocation } : jobLocation) };
  if (remote) ld.jobLocationType = 'TELECOMMUTE';
  if (salary !== undefined && currency) {
    ld.baseSalary = { '@type': 'MonetaryAmount', currency: currency.toUpperCase(), value: { '@type': 'QuantitativeValue', value: String(salary), unitText: salaryUnit } };
  }
  return withExtra(ld, extra);
}

/**
 * Build a SoftwareApplication JSON-LD object.
 *
 * @param {Object} options - `name`, `url?`, `description?`, `operatingSystem?`, `category?`, `price?`, `currency?`, `rating?`, `reviewCount?`.
 * @returns {Object} A JSON-LD SoftwareApplication object.
 */
export function softwareApplication({ name, url, description, operatingSystem, category, price, currency, rating, reviewCount, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'SoftwareApplication', name };
  if (url) ld.url = url;
  if (description) ld.description = description;
  if (operatingSystem) ld.operatingSystem = operatingSystem;
  if (category) ld.applicationCategory = category;
  if (price !== undefined && currency) ld.offers = { '@type': 'Offer', price: String(price), priceCurrency: currency.toUpperCase() };
  if (rating && reviewCount) ld.aggregateRating = aggregateRatingNode({ rating, reviewCount });
  return withExtra(ld, extra);
}

/**
 * Build a Course JSON-LD object — education / tutorials.
 *
 * @param {Object} options - `name`, `description`, `provider` (name or Org node), `url?`.
 * @returns {Object} A JSON-LD Course object.
 */
export function course({ name, description, provider, url, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'Course', name, description };
  if (url) ld.url = url;
  if (provider) ld.provider = orgNode(provider);
  return withExtra(ld, extra);
}

/**
 * Build a Service JSON-LD object.
 *
 * @param {Object} options - `name`, `description?`, `provider?` (name or Org node), `serviceType?`, `areaServed?`, `url?`.
 * @returns {Object} A JSON-LD Service object.
 */
export function service({ name, description, provider, serviceType, areaServed, url, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'Service', name };
  if (description) ld.description = description;
  if (serviceType) ld.serviceType = serviceType;
  if (areaServed) ld.areaServed = areaServed;
  if (url) ld.url = url;
  if (provider) ld.provider = orgNode(provider);
  return withExtra(ld, extra);
}
