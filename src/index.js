/**
 * @arraypress/jsonld
 *
 * JSON-LD structured data builders for SEO — the Schema.org types used by
 * content, commerce, profile, directory, property, music and careers sites:
 * Product, Article, BlogPosting, NewsArticle, Person, Organization, WebSite,
 * WebPage, ProfilePage, Breadcrumb, FAQ, HowTo, Event, JobPosting,
 * LocalBusiness, SoftwareApplication, Course, Recipe, VideoObject,
 * ImageObject, Service, Review, AggregateRating, Offer, CollectionPage,
 * ItemList, Menu, RealEstateListing, Accommodation and the MusicGroup family.
 *
 * `localBusiness()`, `organization()`, `event()` and `accommodation()` take a
 * `type` option covering their whole Schema.org subtype tree, so one directory
 * codebase serves dentists, restaurants, garages, venues and estate agents.
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

/* Schema.org's DayOfWeek wants full English day names. Directory data rarely
 * arrives that way, so accept the common abbreviations and normalise. Anything
 * unrecognised passes through untouched — a caller with a full schema.org URL
 * (`https://schema.org/Monday`) is already correct and must not be mangled. */
const DAYS = {
  mo: 'Monday', mon: 'Monday', monday: 'Monday',
  tu: 'Tuesday', tue: 'Tuesday', tues: 'Tuesday', tuesday: 'Tuesday',
  we: 'Wednesday', wed: 'Wednesday', wednesday: 'Wednesday',
  th: 'Thursday', thu: 'Thursday', thur: 'Thursday', thurs: 'Thursday', thursday: 'Thursday',
  fr: 'Friday', fri: 'Friday', friday: 'Friday',
  sa: 'Saturday', sat: 'Saturday', saturday: 'Saturday',
  su: 'Sunday', sun: 'Sunday', sunday: 'Sunday',
};

const dayName = (d) => (typeof d === 'string' ? DAYS[d.trim().toLowerCase()] ?? d : d);

/* Build the OpeningHoursSpecification array Google reads for opening-hours
 * rich results. A closed day is expressed as opens === closes === '00:00',
 * which is Google's documented convention — omitting the day entirely says
 * "unknown", not "closed", and those mean different things in a directory. */
function openingHoursNodes(hours) {
  const list = Array.isArray(hours) ? hours : [hours];
  return list.filter(Boolean).map((h) => {
    const days = h.days ?? h.dayOfWeek;
    const node = { '@type': 'OpeningHoursSpecification' };
    if (days) node.dayOfWeek = (Array.isArray(days) ? days : [days]).map(dayName);
    if (h.closed) {
      node.opens = '00:00';
      node.closes = '00:00';
    } else {
      if (h.opens) node.opens = h.opens;
      if (h.closes) node.closes = h.closes;
    }
    if (h.validFrom) node.validFrom = h.validFrom;
    if (h.validThrough) node.validThrough = h.validThrough;
    return node;
  });
}

/* Drop `@context` from a node that's about to be nested inside another. A
 * repeated @context is legal JSON-LD but noise, and it lets the builders here
 * compose with each other — pass `localBusiness()` output straight into
 * `itemList()` and it lands as a clean nested node. */
const stripContext = (node) => {
  const { '@context': _ctx, ...rest } = node;
  return rest;
};

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
 * @param {string} [options.offerUrl] - URL where the product can be purchased (the Offer's `url`). Defaults to `url` when omitted — set this to an external checkout/buy link.
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
export function product({ name, url, offerUrl, description, image, sku, brand, price, currency, availability, priceValidUntil, rating, reviewCount, reviews, additionalProperty, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'Product', name, url };
  if (description) ld.description = description;
  if (image) ld.image = image;
  if (sku) ld.sku = sku;
  if (brand) ld.brand = typeof brand === 'string' ? { '@type': 'Organization', name: brand } : brand;
  if (price !== undefined && currency) ld.offers = offerNode({ price, currency, url: offerUrl || url, availability, priceValidUntil });
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
  // Schema.org types width/height as Distance/QuantitativeValue (not a bare
  // number), so wrap pixel dimensions as a QuantitativeValue.
  if (width) ld.width = { '@type': 'QuantitativeValue', value: width };
  if (height) ld.height = { '@type': 'QuantitativeValue', value: height };
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
export function organization({ name, type = 'Organization', url, logo, description, sameAs, address, phone, email, extra }) {
  const ld = { '@context': CONTEXT, '@type': type, name, url };
  if (logo) ld.logo = logo;
  if (description) ld.description = description;
  if (sameAs && sameAs.length) ld.sameAs = sameAs;
  if (address) ld.address = addressNode(address);
  if (phone) ld.telephone = phone;
  if (email) ld.email = email;
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

/**
 * Build a DefinedTerm JSON-LD object — a term inside a controlled vocabulary.
 *
 * Use for an entry that is one of a named set: a personality type within a
 * framework, a tag within a taxonomy, a term within a glossary. `inSet` links
 * it to the DefinedTermSet so a consumer knows INFJ belongs to "16 Types"
 * rather than being a free-floating page.
 *
 * @param {Object} options - `name`, `description?`, `url?`, `termCode?`, `inSet?` ({name, url?}), `extra?`.
 * @returns {Object} A JSON-LD DefinedTerm object.
 */
export function definedTerm({ name, description, url, termCode, inSet, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'DefinedTerm', name };
  if (description) ld.description = description;
  if (url) ld.url = url;
  if (termCode) ld.termCode = termCode;
  if (inSet) {
    ld.inDefinedTermSet = { '@type': 'DefinedTermSet', name: inSet.name };
    if (inSet.url) ld.inDefinedTermSet.url = inSet.url;
  }
  return withExtra(ld, extra);
}

/**
 * Build a Quiz JSON-LD object — an assessment a visitor completes.
 *
 * `numberOfQuestions` and `educationalLevel` are optional; `about` names what
 * the quiz measures. Note schema.org models Quiz as a LearningResource, which
 * is the closest fit for a self-assessment.
 *
 * @param {Object} options - `name`, `url?`, `description?`, `numberOfQuestions?`, `about?`, `provider?`, `extra?`.
 * @returns {Object} A JSON-LD Quiz object.
 */
export function quiz({ name, url, description, numberOfQuestions, about, provider, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'Quiz', name };
  if (url) ld.url = url;
  if (description) ld.description = description;
  if (numberOfQuestions) ld.numberOfQuestions = numberOfQuestions;
  if (about) ld.about = { '@type': 'Thing', name: about };
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
export function event({ name, type = 'Event', url, startDate, endDate, location, description, image, organizer, performer, price, currency, offerUrl, status, attendanceMode, extra }) {
  const ld = { '@context': CONTEXT, '@type': type, name, startDate };
  if (url) ld.url = url;
  if (endDate) ld.endDate = endDate;
  if (description) ld.description = description;
  if (image) ld.image = image;
  if (location) ld.location = typeof location === 'string' ? { '@type': 'Place', name: location } : location;
  if (organizer) ld.organizer = orgNode(organizer);
  /* A gig's performer is a MusicGroup, not an Organization — Google reads it
   * for the artist's event listings, so a bare string defaults accordingly. */
  if (performer) {
    ld.performer = (Array.isArray(performer) ? performer : [performer])
      .map((p) => (typeof p === 'string' ? { '@type': 'MusicGroup', name: p } : p));
  }
  if (price !== undefined) ld.offers = offerNode({ price, currency, url: offerUrl || url });
  if (status) ld.eventStatus = `${CONTEXT}/${status}`;
  if (attendanceMode) ld.eventAttendanceMode = `${CONTEXT}/${attendanceMode}`;
  return withExtra(ld, extra);
}

/**
 * Build a LocalBusiness JSON-LD object — the workhorse for directory listings.
 *
 * `type` narrows the entity to any LocalBusiness subtype, which is what makes
 * one directory theme serve dentists, restaurants, venues and estate agents
 * alike. Google treats the subtype as a LocalBusiness for rich results and
 * uses it to understand the vertical, so a narrower type is always better
 * than the bare default.
 *
 * @param {Object} options - Business data.
 * @param {string} options.name - Business name.
 * @param {string} [options.type='LocalBusiness'] - Any LocalBusiness subtype —
 *   `Dentist`, `Restaurant`, `RealEstateAgent`, `MusicVenue`, `NightClub`,
 *   `Physician`, `MedicalClinic`, `AutoDealer`, `Store`, `HairSalon`… See
 *   `LocalBusinessType` in the type definitions for the full list.
 * @param {string} [options.url] - Canonical URL for the listing.
 * @param {string|Object} [options.address] - Street string or PostalAddress fields.
 * @param {string} [options.phone] - Contact telephone.
 * @param {string|string[]} [options.image] - Image URL(s).
 * @param {string} [options.priceRange] - e.g. `'££'` or `'$$$'`.
 * @param {number} [options.rating] - Aggregate rating value.
 * @param {number} [options.reviewCount] - Number of ratings behind it.
 * @param {Object} [options.geo] - `{ latitude, longitude }`.
 * @param {Object|Object[]} [options.openingHours] - One or more
 *   `{ days, opens, closes }` entries; `{ days, closed: true }` marks a
 *   closed day. Day names accept `'Mon'`, `'monday'`, `'Monday'`.
 * @param {string} [options.email] - Contact email.
 * @param {string[]} [options.servesCuisine] - Restaurants: cuisines served.
 * @param {string} [options.menu] - Restaurants: URL of the menu.
 * @param {boolean} [options.acceptsReservations] - Restaurants: takes bookings.
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD LocalBusiness (or subtype) object.
 *
 * @example
 * localBusiness({
 *   type: 'Dentist',
 *   name: 'Bristol Smile Clinic',
 *   address: { streetAddress: '12 Park St', addressLocality: 'Bristol', postalCode: 'BS1 5JA' },
 *   phone: '+44 117 000 0000',
 *   openingHours: [
 *     { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], opens: '09:00', closes: '17:30' },
 *     { days: 'Sat', opens: '09:00', closes: '13:00' },
 *     { days: 'Sun', closed: true },
 *   ],
 * });
 */
export function localBusiness({
  name, type = 'LocalBusiness', url, address, phone, email, image, priceRange,
  rating, reviewCount, geo, openingHours, servesCuisine, menu, acceptsReservations, extra,
}) {
  const ld = { '@context': CONTEXT, '@type': type, name };
  if (url) ld.url = url;
  if (image) ld.image = image;
  if (phone) ld.telephone = phone;
  if (email) ld.email = email;
  if (priceRange) ld.priceRange = priceRange;
  if (address) ld.address = addressNode(address);
  if (geo) ld.geo = { '@type': 'GeoCoordinates', ...geo };
  if (openingHours) ld.openingHoursSpecification = openingHoursNodes(openingHours);
  if (servesCuisine) ld.servesCuisine = servesCuisine;
  if (menu) ld.hasMenu = menu;
  if (acceptsReservations !== undefined) ld.acceptsReservations = acceptsReservations;
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

/**
 * Build an ItemList JSON-LD object — directory and archive pages.
 *
 * This is what turns "Dentists in Bristol" into a result Google can present
 * as a carousel rather than a single blue link. Items may be plain URLs, plain
 * names, or whole nodes built by the other helpers here — a listing page that
 * already renders `localBusiness()` nodes should pass those straight in.
 *
 * @param {Object} options - List data.
 * @param {Array<string|Object>} options.items - URLs, names, or nested nodes.
 * @param {string} [options.name] - Name of the list, e.g. 'Dentists in Bristol'.
 * @param {string} [options.url] - Canonical URL of the listing page.
 * @param {string} [options.order='ItemListOrderAscending'] - Ordering, or
 *   `'ItemListUnordered'` when position carries no meaning.
 * @param {number} [options.startPosition=1] - First position number; pass the
 *   offset on a paginated archive so page 2 doesn't restart at 1.
 * @param {number} [options.totalItems] - Total across all pages, when paginated.
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD ItemList object.
 *
 * @example
 * itemList({
 *   name: 'Dentists in Bristol',
 *   url: 'https://example.com/bristol/dentists',
 *   items: [
 *     'https://example.com/bristol/dentists/smile-clinic',
 *     'https://example.com/bristol/dentists/park-street-dental',
 *   ],
 * });
 *
 * @example
 * // Page 3 of a paginated archive, with full nodes inline.
 * itemList({ items: businesses.map(localBusiness), startPosition: 41, totalItems: 220 });
 */
export function itemList({ items = [], name, url, order = 'ItemListOrderAscending', startPosition = 1, totalItems, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'ItemList' };
  if (name) ld.name = name;
  if (url) ld.url = url;
  if (order) ld.itemListOrder = order;
  ld.numberOfItems = totalItems ?? items.length;
  ld.itemListElement = items.map((item, i) => {
    const el = { '@type': 'ListItem', position: startPosition + i };
    if (typeof item !== 'string') {
      /* A nested node carries its own @type, so hand it over whole and drop the
       * @context — nesting a second @context is legal but noisy, and Google
       * reads the outer one. */
      const { '@context': _ctx, ...node } = item;
      el.item = node;
    } else if (/^https?:\/\//i.test(item)) {
      el.url = item;
    } else {
      el.name = item;
    }
    return el;
  });
  return withExtra(ld, extra);
}

/**
 * Build a Menu JSON-LD object — restaurants and cafés.
 *
 * @param {Object} options - Menu data.
 * @param {string} [options.name] - Menu name, e.g. 'Dinner'.
 * @param {string} [options.url] - URL of the menu page.
 * @param {Array<Object>} [options.sections] - `menuSection()` options objects.
 * @param {Array<Object>} [options.items] - `menuItem()` options, for a flat menu.
 * @param {string} [options.description] - Short description.
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD Menu object.
 *
 * @example
 * menu({
 *   name: 'Dinner',
 *   sections: [
 *     { name: 'Small plates', items: [{ name: 'Padrón peppers', price: 6.5, currency: 'gbp' }] },
 *   ],
 * });
 */
export function menu({ name, url, sections, items, description, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'Menu' };
  if (name) ld.name = name;
  if (url) ld.url = url;
  if (description) ld.description = description;
  if (sections) ld.hasMenuSection = sections.map((s) => stripContext(menuSection(s)));
  if (items) ld.hasMenuItem = items.map((i) => stripContext(menuItem(i)));
  return withExtra(ld, extra);
}

/**
 * Build a MenuSection JSON-LD object — a named course or group within a menu.
 *
 * @param {Object} options - Section data.
 * @param {string} options.name - Section name, e.g. 'Desserts'.
 * @param {Array<Object>} [options.items] - `menuItem()` options objects.
 * @param {string} [options.description] - Short description.
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD MenuSection object.
 */
export function menuSection({ name, items, description, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'MenuSection', name };
  if (description) ld.description = description;
  if (items) ld.hasMenuItem = items.map((i) => stripContext(menuItem(i)));
  return withExtra(ld, extra);
}

/**
 * Build a MenuItem JSON-LD object — one dish.
 *
 * @param {Object} options - Item data.
 * @param {string} options.name - Dish name.
 * @param {string} [options.description] - Description.
 * @param {number|string} [options.price] - Price value.
 * @param {string} [options.currency] - ISO 4217 code; required for the price to mean anything.
 * @param {string[]} [options.suitableForDiet] - e.g. `['VeganDiet', 'GlutenFreeDiet']`,
 *   with or without the schema.org URL prefix.
 * @param {number} [options.calories] - Energy content in kcal.
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD MenuItem object.
 */
export function menuItem({ name, description, price, currency, suitableForDiet, calories, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'MenuItem', name };
  if (description) ld.description = description;
  if (price !== undefined) ld.offers = offerNode({ price, currency });
  if (suitableForDiet) {
    ld.suitableForDiet = (Array.isArray(suitableForDiet) ? suitableForDiet : [suitableForDiet])
      .map((d) => (d.startsWith('http') ? d : `${CONTEXT}/${d}`));
  }
  if (calories) ld.nutrition = { '@type': 'NutritionInformation', calories: `${calories} calories` };
  return withExtra(ld, extra);
}

// ── Property ────────────────────────────────

/**
 * Build a RealEstateListing JSON-LD object — a property for sale or to let.
 *
 * The listing is the *advert*; the thing being advertised is an Accommodation
 * (or Residence) node under `about`. Keeping them separate is what lets a
 * portal mark up both "this page went live on Tuesday" and "this flat has two
 * bedrooms" without conflating them.
 *
 * @param {Object} options - Listing data.
 * @param {string} options.name - Listing headline.
 * @param {string} [options.url] - Listing URL.
 * @param {string} [options.description] - Full description.
 * @param {string|string[]} [options.image] - Photograph URL(s).
 * @param {number|string} [options.price] - Asking price or rent.
 * @param {string} [options.currency] - ISO 4217 code.
 * @param {string} [options.datePosted] - ISO 8601 date the listing went live.
 * @param {string|Object} [options.address] - Street string or PostalAddress fields.
 * @param {Object} [options.geo] - `{ latitude, longitude }`.
 * @param {Object} [options.accommodation] - `accommodation()` options for the property itself.
 * @param {Object|string} [options.agent] - Listing agent name or node.
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD RealEstateListing object.
 *
 * @example
 * realEstateListing({
 *   name: '2-bed flat, Clifton',
 *   price: 1450, currency: 'gbp',
 *   datePosted: '2026-08-01',
 *   address: { addressLocality: 'Bristol', postalCode: 'BS8 1AA' },
 *   accommodation: { type: 'Apartment', numberOfBedrooms: 2, numberOfBathroomsTotal: 1, floorSize: 68 },
 * });
 */
export function realEstateListing({ name, url, description, image, price, currency, datePosted, address, geo, accommodation: acc, agent, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'RealEstateListing', name };
  if (url) ld.url = url;
  if (description) ld.description = description;
  if (image) ld.image = image;
  if (datePosted) ld.datePosted = datePosted;
  if (price !== undefined) ld.offers = offerNode({ price, currency, url });
  if (agent) ld.provider = typeof agent === 'string' ? { '@type': 'RealEstateAgent', name: agent } : agent;
  /* RealEstateListing descends from WebPage — it is the advert, not the place,
   * so it has no `address` or `geo` of its own. Callers naturally pass them at
   * the top level anyway, so fold them into the Accommodation (a Place, which
   * does have them). Validated against schema-dts, which rejects the flat form. */
  if (acc || address || geo) {
    ld.about = stripContext(accommodation({ ...(acc ?? {}), address: acc?.address ?? address, geo: acc?.geo ?? geo }));
  }
  return withExtra(ld, extra);
}

/**
 * Build an Accommodation JSON-LD object — the dwelling itself.
 *
 * @param {Object} options - Property data.
 * @param {string} [options.type='Accommodation'] - `Apartment`, `House`,
 *   `SingleFamilyResidence`, `Room`, `Suite`, `CampingPitch` or `Accommodation`.
 * @param {string} [options.name] - Property name.
 * @param {number} [options.numberOfBedrooms] - Bedroom count.
 * @param {number} [options.numberOfBathroomsTotal] - Bathroom count.
 * @param {number} [options.numberOfRooms] - Total rooms.
 * @param {number} [options.floorSize] - Floor area value.
 * @param {string} [options.floorSizeUnit='MTK'] - UN/CEFACT code — `MTK` m², `FTK` ft².
 * @param {string|Object} [options.address] - Street string or PostalAddress fields.
 * @param {string[]} [options.amenities] - Amenity names, e.g. `['Parking', 'Garden']`.
 * @param {number} [options.yearBuilt] - Year of construction.
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD Accommodation (or subtype) object.
 */
export function accommodation({ type = 'Accommodation', name, numberOfBedrooms, numberOfBathroomsTotal, numberOfRooms, floorSize, floorSizeUnit = 'MTK', address, geo, amenities, yearBuilt, extra }) {
  const ld = { '@context': CONTEXT, '@type': type };
  if (name) ld.name = name;
  if (numberOfBedrooms !== undefined) ld.numberOfBedrooms = numberOfBedrooms;
  if (numberOfBathroomsTotal !== undefined) ld.numberOfBathroomsTotal = numberOfBathroomsTotal;
  if (numberOfRooms !== undefined) ld.numberOfRooms = numberOfRooms;
  if (floorSize !== undefined) {
    ld.floorSize = { '@type': 'QuantitativeValue', value: floorSize, unitCode: floorSizeUnit };
  }
  if (address) ld.address = addressNode(address);
  if (geo) ld.geo = { '@type': 'GeoCoordinates', ...geo };
  if (yearBuilt) ld.yearBuilt = yearBuilt;
  if (amenities) {
    ld.amenityFeature = (Array.isArray(amenities) ? amenities : [amenities]).map((a) =>
      typeof a === 'string'
        ? { '@type': 'LocationFeatureSpecification', name: a, value: true }
        : { '@type': 'LocationFeatureSpecification', ...a });
  }
  return withExtra(ld, extra);
}

// ── Music ───────────────────────────────────

/**
 * Build a MusicGroup JSON-LD object — band, artist, DJ or producer.
 *
 * Schema.org has no separate "DJ" type: a solo artist performing under an alias
 * is still a MusicGroup, which is what Google's knowledge panel reads. Use
 * `person()` only when marking up the human behind the alias.
 *
 * @param {Object} options - Artist data.
 * @param {string} options.name - Artist or band name.
 * @param {string} [options.url] - Official page.
 * @param {string|string[]} [options.image] - Press shot URL(s).
 * @param {string} [options.description] - Bio.
 * @param {string} [options.genre] - Musical genre.
 * @param {string[]} [options.sameAs] - Profile URLs — Spotify, Bandcamp, SoundCloud, Discogs.
 * @param {Array<string|Object>} [options.members] - Band members (Person nodes or names).
 * @param {string} [options.foundingDate] - ISO 8601 date formed.
 * @param {string} [options.foundingLocation] - Where they formed.
 * @param {Array<Object>} [options.albums] - `musicAlbum()` options objects.
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD MusicGroup object.
 *
 * @example
 * musicGroup({
 *   name: 'Spindrift',
 *   genre: 'Ambient',
 *   sameAs: ['https://open.spotify.com/artist/…', 'https://spindrift.bandcamp.com'],
 * });
 */
export function musicGroup({ name, url, image, description, genre, sameAs, members, foundingDate, foundingLocation, albums, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'MusicGroup', name };
  if (url) ld.url = url;
  if (image) ld.image = image;
  if (description) ld.description = description;
  if (genre) ld.genre = genre;
  if (sameAs) ld.sameAs = sameAs;
  if (members) ld.member = (Array.isArray(members) ? members : [members]).map(personNode);
  if (foundingDate) ld.foundingDate = foundingDate;
  if (foundingLocation) ld.foundingLocation = typeof foundingLocation === 'string'
    ? { '@type': 'Place', name: foundingLocation } : foundingLocation;
  if (albums) ld.album = albums.map((a) => stripContext(musicAlbum(a)));
  return withExtra(ld, extra);
}

/**
 * Build a MusicAlbum JSON-LD object — a release.
 *
 * @param {Object} options - Album data.
 * @param {string} options.name - Album title.
 * @param {string|Object} [options.artist] - Artist name or MusicGroup node.
 * @param {string} [options.url] - Release page.
 * @param {string|string[]} [options.image] - Artwork URL(s).
 * @param {string} [options.releaseDate] - ISO 8601 release date.
 * @param {string} [options.genre] - Genre.
 * @param {number} [options.numTracks] - Track count.
 * @param {Array<Object>} [options.tracks] - `musicRecording()` options objects.
 * @param {string} [options.albumProductionType] - e.g. `StudioAlbum`, `CompilationAlbum`, `LiveAlbum`.
 * @param {number|string} [options.price] - Price, when it's for sale.
 * @param {string} [options.currency] - ISO 4217 code.
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD MusicAlbum object.
 */
export function musicAlbum({ name, artist, url, image, releaseDate, genre, numTracks, tracks, albumProductionType, price, currency, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'MusicAlbum', name };
  if (artist) ld.byArtist = typeof artist === 'string' ? { '@type': 'MusicGroup', name: artist } : artist;
  if (url) ld.url = url;
  if (image) ld.image = image;
  if (releaseDate) ld.datePublished = releaseDate;
  if (genre) ld.genre = genre;
  if (numTracks !== undefined) ld.numTracks = numTracks;
  if (albumProductionType) ld.albumProductionType = `${CONTEXT}/${albumProductionType}`;
  if (tracks) ld.track = tracks.map((t) => stripContext(musicRecording(t)));
  if (price !== undefined) ld.offers = offerNode({ price, currency, url });
  return withExtra(ld, extra);
}

/**
 * Build a MusicRecording JSON-LD object — a single track.
 *
 * @param {Object} options - Track data.
 * @param {string} options.name - Track title.
 * @param {string|Object} [options.artist] - Artist name or MusicGroup node.
 * @param {string} [options.url] - Track page.
 * @param {string} [options.duration] - ISO 8601 duration, e.g. `'PT4M33S'`.
 * @param {string|Object} [options.album] - Album title or MusicAlbum node.
 * @param {string} [options.audio] - Audio file URL.
 * @param {string} [options.isrc] - ISRC code.
 * @param {Object} [options.extra] - Extra fields, merged last.
 * @returns {Object} A JSON-LD MusicRecording object.
 */
export function musicRecording({ name, artist, url, duration, album, audio, isrc, extra }) {
  const ld = { '@context': CONTEXT, '@type': 'MusicRecording', name };
  if (artist) ld.byArtist = typeof artist === 'string' ? { '@type': 'MusicGroup', name: artist } : artist;
  if (url) ld.url = url;
  if (duration) ld.duration = duration;
  if (album) ld.inAlbum = typeof album === 'string' ? { '@type': 'MusicAlbum', name: album } : album;
  if (audio) ld.audio = { '@type': 'AudioObject', contentUrl: audio };
  if (isrc) ld.isrcCode = isrc;
  return withExtra(ld, extra);
}
