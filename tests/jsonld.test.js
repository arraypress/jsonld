import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { product, article, blogPosting, organization, webSite, breadcrumb, faq, howTo, event, localBusiness, softwareApplication, collectionPage, person, jobPosting, newsArticle, webPage, profilePage, review, aggregateRating, offer, imageObject, videoObject, recipe, course, service } from '../src/index.js';

describe('product', () => {
  it('builds product schema', () => {
    const ld = product({ name: 'Widget', url: 'https://example.com/widget', price: 9.99, currency: 'usd', brand: 'Acme', sku: 'W123' });
    assert.equal(ld['@context'], 'https://schema.org');
    assert.equal(ld['@type'], 'Product');
    assert.equal(ld.name, 'Widget');
    assert.equal(ld.sku, 'W123');
    assert.equal(ld.brand['@type'], 'Organization');
    assert.equal(ld.offers.priceCurrency, 'USD');
    assert.equal(ld.offers.price, '9.99');
  });
  it('includes aggregate rating', () => {
    const ld = product({ name: 'X', url: 'https://x.com', rating: 4.5, reviewCount: 100 });
    assert.equal(ld.aggregateRating.ratingValue, 4.5);
    assert.equal(ld.aggregateRating.reviewCount, 100);
  });
});

describe('article', () => {
  it('builds article schema', () => {
    const ld = article({ headline: 'Test', url: 'https://example.com/post', author: 'Jane', datePublished: '2025-01-01' });
    assert.equal(ld['@type'], 'Article');
    assert.equal(ld.headline, 'Test');
    assert.equal(ld.author['@type'], 'Person');
    assert.equal(ld.author.name, 'Jane');
  });
  it('accepts object author', () => {
    const ld = article({ headline: 'X', url: 'https://x.com', author: { '@type': 'Person', name: 'Bob', url: 'https://bob.com' } });
    assert.equal(ld.author.url, 'https://bob.com');
  });
});

describe('blogPosting', () => {
  it('builds BlogPosting type', () => {
    const ld = blogPosting({ headline: 'Post', url: 'https://example.com/blog/post' });
    assert.equal(ld['@type'], 'BlogPosting');
    assert.equal(ld.headline, 'Post');
  });
});

describe('organization', () => {
  it('builds organization schema', () => {
    const ld = organization({ name: 'Acme', url: 'https://acme.com', logo: 'https://acme.com/logo.png', sameAs: ['https://twitter.com/acme'] });
    assert.equal(ld['@type'], 'Organization');
    assert.equal(ld.logo, 'https://acme.com/logo.png');
    assert.deepEqual(ld.sameAs, ['https://twitter.com/acme']);
  });
});

describe('webSite', () => {
  it('builds website schema', () => {
    const ld = webSite({ name: 'My Site', url: 'https://example.com' });
    assert.equal(ld['@type'], 'WebSite');
    assert.equal(ld.name, 'My Site');
  });
  it('includes search action', () => {
    const ld = webSite({ name: 'My Site', url: 'https://example.com', searchUrl: 'https://example.com/search?q={search_term_string}' });
    assert.equal(ld.potentialAction['@type'], 'SearchAction');
  });
});

describe('breadcrumb', () => {
  it('builds breadcrumb list', () => {
    const ld = breadcrumb([{ name: 'Home', url: 'https://example.com' }, { name: 'Products', url: 'https://example.com/products' }, { name: 'Widget' }]);
    assert.equal(ld['@type'], 'BreadcrumbList');
    assert.equal(ld.itemListElement.length, 3);
    assert.equal(ld.itemListElement[0].position, 1);
    assert.equal(ld.itemListElement[2].item, undefined);
  });
});

describe('faq', () => {
  it('builds FAQ page', () => {
    const ld = faq([{ question: 'Q1?', answer: 'A1' }, { question: 'Q2?', answer: 'A2' }]);
    assert.equal(ld['@type'], 'FAQPage');
    assert.equal(ld.mainEntity.length, 2);
    assert.equal(ld.mainEntity[0]['@type'], 'Question');
    assert.equal(ld.mainEntity[0].acceptedAnswer.text, 'A1');
  });
});

describe('howTo', () => {
  it('builds HowTo schema', () => {
    const ld = howTo({ name: 'Fix a bike', steps: [{ name: 'Step 1', text: 'Remove wheel' }, { name: 'Step 2', text: 'Patch tube' }], totalTime: 'PT30M' });
    assert.equal(ld['@type'], 'HowTo');
    assert.equal(ld.step.length, 2);
    assert.equal(ld.step[0].position, 1);
    assert.equal(ld.totalTime, 'PT30M');
  });
});

describe('event', () => {
  it('builds event schema', () => {
    const ld = event({ name: 'Concert', startDate: '2025-06-01', location: 'Madison Square Garden', organizer: 'Live Nation' });
    assert.equal(ld['@type'], 'Event');
    assert.equal(ld.location['@type'], 'Place');
    assert.equal(ld.organizer['@type'], 'Organization');
  });
});

describe('localBusiness', () => {
  it('builds local business schema', () => {
    const ld = localBusiness({ name: 'Pizza Place', url: 'https://pizza.com', phone: '555-1234', address: '123 Main St', priceRange: '$$', rating: 4.2, reviewCount: 50 });
    assert.equal(ld['@type'], 'LocalBusiness');
    assert.equal(ld.telephone, '555-1234');
    assert.equal(ld.address['@type'], 'PostalAddress');
    assert.ok(ld.aggregateRating);
  });
  it('accepts object address and geo', () => {
    const ld = localBusiness({ name: 'Shop', address: { streetAddress: '1 St', addressLocality: 'NYC' }, geo: { latitude: 40.7, longitude: -74.0 } });
    assert.equal(ld.address.addressLocality, 'NYC');
    assert.equal(ld.geo['@type'], 'GeoCoordinates');
  });
});

describe('softwareApplication', () => {
  it('builds software application schema', () => {
    const ld = softwareApplication({ name: 'MyApp', url: 'https://myapp.com', category: 'BusinessApplication', price: 0, currency: 'usd', operatingSystem: 'Windows, macOS' });
    assert.equal(ld['@type'], 'SoftwareApplication');
    assert.equal(ld.applicationCategory, 'BusinessApplication');
    assert.equal(ld.offers.price, '0');
    assert.equal(ld.offers.priceCurrency, 'USD');
  });
});

describe('collectionPage', () => {
  it('builds collection page schema', () => {
    const ld = collectionPage({ name: 'Products', url: 'https://example.com/products', description: 'All products', provider: 'My Store' });
    assert.equal(ld['@type'], 'CollectionPage');
    assert.equal(ld.provider['@type'], 'Organization');
  });
});

describe('v1.1.0 — new types + passthrough', () => {
  it('person', () => {
    const ld = person({ name: 'Jane Doe', url: 'https://jane.dev', jobTitle: 'Designer', sameAs: ['https://x.com/jane'] });
    assert.equal(ld['@type'], 'Person');
    assert.equal(ld.jobTitle, 'Designer');
    assert.deepEqual(ld.sameAs, ['https://x.com/jane']);
  });

  it('jobPosting with org + location + remote + salary', () => {
    const ld = jobPosting({ title: 'Engineer', description: 'd', datePosted: '2026-06-01', hiringOrganization: 'Acme', jobLocation: 'Remote', employmentType: 'FULL_TIME', remote: true, salary: 120000, currency: 'usd' });
    assert.equal(ld['@type'], 'JobPosting');
    assert.equal(ld.hiringOrganization['@type'], 'Organization');
    assert.equal(ld.jobLocation['@type'], 'Place');
    assert.equal(ld.jobLocationType, 'TELECOMMUTE');
    assert.equal(ld.baseSalary.currency, 'USD');
    assert.equal(ld.baseSalary.value.value, '120000');
  });

  it('newsArticle is an Article variant', () => {
    assert.equal(newsArticle({ headline: 'X', url: 'https://x.com' })['@type'], 'NewsArticle');
  });

  it('article supports section + keywords', () => {
    const ld = article({ headline: 'X', url: 'https://x.com', section: 'Tech', keywords: ['a', 'b'] });
    assert.equal(ld.articleSection, 'Tech');
    assert.equal(ld.keywords, 'a, b');
  });

  it('webPage / profilePage / course / service / offer / review / aggregateRating / imageObject / videoObject / recipe', () => {
    assert.equal(webPage({ name: 'P', url: 'u' })['@type'], 'WebPage');
    const pp = profilePage({ mainEntity: { name: 'Jane' }, url: 'u' });
    assert.equal(pp['@type'], 'ProfilePage');
    assert.equal(pp.mainEntity['@type'], 'Person');
    assert.equal(course({ name: 'C', description: 'd', provider: 'Acme' }).provider['@type'], 'Organization');
    assert.equal(service({ name: 'S' })['@type'], 'Service');
    assert.equal(offer({ price: 9, currency: 'usd' }).priceCurrency, 'USD');
    assert.equal(review({ rating: 5, author: 'Bob' }).reviewRating.ratingValue, 5);
    assert.equal(aggregateRating({ rating: 4.5, reviewCount: 10 }).ratingValue, 4.5);
    assert.equal(imageObject({ url: 'i', width: 1200 }).width.value, 1200);
    assert.equal(videoObject({ name: 'V', description: 'd', thumbnailUrl: 't', uploadDate: '2026-01-01' })['@type'], 'VideoObject');
    assert.equal(recipe({ name: 'R', ingredients: ['x'], instructions: ['mix'] }).recipeInstructions[0]['@type'], 'HowToStep');
  });

  it('enriched product: reviews + additionalProperty', () => {
    const ld = product({ name: 'P', url: 'u', reviews: [{ rating: 5, author: 'Jane', body: 'Great' }], additionalProperty: [{ name: 'Format', value: 'WAV' }] });
    assert.equal(ld.review[0]['@type'], 'Review');
    assert.equal(ld.review[0].author.name, 'Jane');
    assert.equal(ld.additionalProperty[0]['@type'], 'PropertyValue');
    assert.equal(ld.additionalProperty[0].value, 'WAV');
  });

  it('extra passthrough is merged last', () => {
    const ld = person({ name: 'Jane', extra: { inLanguage: 'en', knowsAbout: ['design'] } });
    assert.equal(ld.inLanguage, 'en');
    assert.deepEqual(ld.knowsAbout, ['design']);
  });
});
