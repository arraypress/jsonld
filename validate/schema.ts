/**
 * Static validation of every builder's output shape against the official
 * Schema.org vocabulary (Google's `schema-dts`, generated from schema.org).
 * `npm run validate` (tsc --noEmit) fails if any shape is invalid.
 */
import type {
  WithContext, Product, Offer, Review, AggregateRating, Article, BlogPosting, NewsArticle,
  Recipe, VideoObject, ImageObject, Person, Organization, WebSite, WebPage, ProfilePage,
  BreadcrumbList, FAQPage, HowTo, CollectionPage, Event, LocalBusiness, JobPosting,
  SoftwareApplication, Course, Service,
} from 'schema-dts';

const C = 'https://schema.org' as const;

export const samples: Record<string, object> = {
  product: { '@context': C, '@type': 'Product', name: 'X', url: 'u', description: 'd', image: 'i', sku: 's',
    brand: { '@type': 'Organization', name: 'Acme' },
    offers: { '@type': 'Offer', url: 'u', priceCurrency: 'USD', price: '9', availability: 'https://schema.org/InStock' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: 4.8, reviewCount: 64, bestRating: 5 },
    additionalProperty: [{ '@type': 'PropertyValue', name: 'Format', value: 'WAV' }],
    review: [{ '@type': 'Review', reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 }, author: { '@type': 'Person', name: 'Jane' }, reviewBody: 'b', datePublished: '2026-01-01' }] } satisfies WithContext<Product>,
  offer: { '@context': C, '@type': 'Offer', url: 'u', price: '9', priceCurrency: 'USD', availability: 'https://schema.org/InStock', priceValidUntil: '2026-12-31' } satisfies WithContext<Offer>,
  review: { '@context': C, '@type': 'Review', reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 }, author: { '@type': 'Person', name: 'B' }, reviewBody: 'b', datePublished: '2026-01-01' } satisfies WithContext<Review>,
  aggregateRating: { '@context': C, '@type': 'AggregateRating', ratingValue: 4.5, reviewCount: 10, bestRating: 5 } satisfies WithContext<AggregateRating>,
  article: { '@context': C, '@type': 'Article', headline: 'H', url: 'u', description: 'd', image: 'i', datePublished: '2026-01-01', dateModified: '2026-01-02', author: { '@type': 'Person', name: 'J' }, publisher: { '@type': 'Organization', name: 'O' }, articleSection: 'Tech', keywords: 'a, b' } satisfies WithContext<Article>,
  blogPosting: { '@context': C, '@type': 'BlogPosting', headline: 'H', url: 'u' } satisfies WithContext<BlogPosting>,
  newsArticle: { '@context': C, '@type': 'NewsArticle', headline: 'H', url: 'u' } satisfies WithContext<NewsArticle>,
  recipe: { '@context': C, '@type': 'Recipe', name: 'R', image: 'i', author: { '@type': 'Person', name: 'J' }, description: 'd', datePublished: '2026-01-01', prepTime: 'PT15M', cookTime: 'PT30M', totalTime: 'PT45M', recipeYield: '4', recipeIngredient: ['x'], recipeInstructions: [{ '@type': 'HowToStep', text: 'mix' }] } satisfies WithContext<Recipe>,
  videoObject: { '@context': C, '@type': 'VideoObject', name: 'V', description: 'd', thumbnailUrl: 't', uploadDate: '2026-01-01', contentUrl: 'c', embedUrl: 'e', duration: 'PT2M' } satisfies WithContext<VideoObject>,
  imageObject: { '@context': C, '@type': 'ImageObject', url: 'i', width: { '@type': 'QuantitativeValue', value: 1200 }, height: { '@type': 'QuantitativeValue', value: 630 }, caption: 'c' } satisfies WithContext<ImageObject>,
  person: { '@context': C, '@type': 'Person', name: 'J', url: 'u', image: 'i', jobTitle: 'D', description: 'b', email: 'e@x', worksFor: { '@type': 'Organization', name: 'O' }, sameAs: ['s'] } satisfies WithContext<Person>,
  organization: { '@context': C, '@type': 'Organization', name: 'O', url: 'u', logo: 'l', description: 'd', sameAs: ['s'] } satisfies WithContext<Organization>,
  webSite: { '@context': C, '@type': 'WebSite', name: 'W', url: 'u', potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: 'u?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } } as WithContext<WebSite>, // `query-input` is Google's sitelinks-searchbox extension (official), not in core schema.org / schema-dts
  webPage: { '@context': C, '@type': 'WebPage', name: 'P', url: 'u', description: 'd', primaryImageOfPage: { '@type': 'ImageObject', url: 'i' }, datePublished: '2026-01-01', dateModified: '2026-01-02' } satisfies WithContext<WebPage>,
  profilePage: { '@context': C, '@type': 'ProfilePage', url: 'u', dateCreated: '2026-01-01', dateModified: '2026-01-02', mainEntity: { '@type': 'Person', name: 'J' } } satisfies WithContext<ProfilePage>,
  breadcrumb: { '@context': C, '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'u' }, { '@type': 'ListItem', position: 2, name: 'Now' }] } satisfies WithContext<BreadcrumbList>,
  faq: { '@context': C, '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'Q?', acceptedAnswer: { '@type': 'Answer', text: 'A' } }] } satisfies WithContext<FAQPage>,
  howTo: { '@context': C, '@type': 'HowTo', name: 'H', description: 'd', totalTime: 'PT5M', step: [{ '@type': 'HowToStep', position: 1, name: 'S', text: 't', url: 'u', image: 'i' }] } satisfies WithContext<HowTo>,
  collectionPage: { '@context': C, '@type': 'CollectionPage', name: 'C', url: 'u', description: 'd', provider: { '@type': 'Organization', name: 'O' } } satisfies WithContext<CollectionPage>,
  event: { '@context': C, '@type': 'Event', name: 'E', startDate: '2026-06-01T18:00:00Z', url: 'u', endDate: '2026-06-01T20:00:00Z', description: 'd', image: 'i', location: { '@type': 'Place', name: 'V' }, organizer: { '@type': 'Organization', name: 'O' } } satisfies WithContext<Event>,
  localBusiness: { '@context': C, '@type': 'LocalBusiness', name: 'B', url: 'u', image: 'i', telephone: '+1', priceRange: '$$', address: { '@type': 'PostalAddress', streetAddress: '123 Main', addressLocality: 'Town' }, geo: { '@type': 'GeoCoordinates', latitude: 1, longitude: 2 }, aggregateRating: { '@type': 'AggregateRating', ratingValue: 4, reviewCount: 5, bestRating: 5 } } satisfies WithContext<LocalBusiness>,
  jobPosting: { '@context': C, '@type': 'JobPosting', title: 'E', description: 'd', datePosted: '2026-06-01', hiringOrganization: { '@type': 'Organization', name: 'A' }, url: 'u', validThrough: '2026-12-31', employmentType: 'FULL_TIME', jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Remote' } }, jobLocationType: 'TELECOMMUTE', baseSalary: { '@type': 'MonetaryAmount', currency: 'USD', value: { '@type': 'QuantitativeValue', value: '120000', unitText: 'YEAR' } } } satisfies WithContext<JobPosting>,
  softwareApplication: { '@context': C, '@type': 'SoftwareApplication', name: 'S', url: 'u', description: 'd', operatingSystem: 'macOS', applicationCategory: 'DeveloperApplication', offers: { '@type': 'Offer', price: '49', priceCurrency: 'USD' }, aggregateRating: { '@type': 'AggregateRating', ratingValue: 4, reviewCount: 5, bestRating: 5 } } satisfies WithContext<SoftwareApplication>,
  course: { '@context': C, '@type': 'Course', name: 'C', description: 'd', url: 'u', provider: { '@type': 'Organization', name: 'O' } } satisfies WithContext<Course>,
  service: { '@context': C, '@type': 'Service', name: 'S', description: 'd', serviceType: 'T', areaServed: 'US', url: 'u', provider: { '@type': 'Organization', name: 'O' } } satisfies WithContext<Service>,
};
void samples;
