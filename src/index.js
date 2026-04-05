const CONTEXT = 'https://schema.org';

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

export function blogPosting(opts) {
  return { ...article(opts), '@type': 'BlogPosting' };
}

export function organization({ name, url, logo, description, sameAs }) {
  const ld = { '@context': CONTEXT, '@type': 'Organization', name, url };
  if (logo) ld.logo = logo;
  if (description) ld.description = description;
  if (sameAs && sameAs.length) ld.sameAs = sameAs;
  return ld;
}

export function webSite({ name, url, searchUrl }) {
  const ld = { '@context': CONTEXT, '@type': 'WebSite', name, url };
  if (searchUrl) {
    ld.potentialAction = { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: searchUrl }, 'query-input': 'required name=search_term_string' };
  }
  return ld;
}

export function breadcrumb(items) {
  return {
    '@context': CONTEXT, '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem', position: i + 1, name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function faq(items) {
  return {
    '@context': CONTEXT, '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question', name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export function howTo({ name, description, steps, totalTime }) {
  const ld = { '@context': CONTEXT, '@type': 'HowTo', name };
  if (description) ld.description = description;
  if (totalTime) ld.totalTime = totalTime;
  if (steps) ld.step = steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text, ...(s.url ? { url: s.url } : {}), ...(s.image ? { image: s.image } : {}) }));
  return ld;
}

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

export function collectionPage({ name, url, description, provider }) {
  const ld = { '@context': CONTEXT, '@type': 'CollectionPage', name, url };
  if (description) ld.description = description;
  if (provider) ld.provider = typeof provider === 'string' ? { '@type': 'Organization', name: provider } : provider;
  return ld;
}
