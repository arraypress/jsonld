import type { WithContext, Product, Person, JobPosting } from 'schema-dts';

// Validate that the shapes our builders emit are valid Schema.org per the
// official vocabulary (schema-dts is generated from schema.org).
const _product: WithContext<Product> = {
  '@context': 'https://schema.org', '@type': 'Product', name: 'X', url: 'https://x',
  brand: { '@type': 'Organization', name: 'Acme' },
  offers: { '@type': 'Offer', url: 'https://x', priceCurrency: 'USD', price: '9', availability: 'https://schema.org/InStock' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: 4.8, reviewCount: 64, bestRating: 5 },
  additionalProperty: [{ '@type': 'PropertyValue', name: 'Format', value: 'WAV' }],
  review: [{ '@type': 'Review', reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 }, author: { '@type': 'Person', name: 'Jane' } }],
};
const _person: WithContext<Person> = {
  '@context': 'https://schema.org', '@type': 'Person', name: 'Jane', jobTitle: 'Designer', sameAs: ['https://x.com/jane'],
};
const _job: WithContext<JobPosting> = {
  '@context': 'https://schema.org', '@type': 'JobPosting', title: 'Eng', description: 'd', datePosted: '2026-06-01',
  hiringOrganization: { '@type': 'Organization', name: 'Acme' },
  jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Remote' } },
  jobLocationType: 'TELECOMMUTE',
  baseSalary: { '@type': 'MonetaryAmount', currency: 'USD', value: { '@type': 'QuantitativeValue', value: '120000', unitText: 'YEAR' } },
};
void [_product, _person, _job];
