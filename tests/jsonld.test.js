import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { product, article, blogPosting, organization, webSite, breadcrumb, faq, howTo, event, localBusiness, softwareApplication, collectionPage, person, jobPosting, newsArticle, webPage, profilePage, review, aggregateRating, offer, imageObject, videoObject, recipe, course, service, itemList, menu, menuSection, menuItem, realEstateListing, accommodation, musicGroup, musicAlbum, musicRecording, buildGraph, person as personLd } from '../src/index.js';

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
  it('offerUrl points the Offer at a separate buy link', () => {
    const ld = product({ name: 'X', url: 'https://x.com/p', offerUrl: 'https://buy.example.com/p', price: 29, currency: 'gbp' });
    assert.equal(ld.url, 'https://x.com/p');
    assert.equal(ld.offers.url, 'https://buy.example.com/p');
  });
  it('Offer falls back to the product url when offerUrl is omitted', () => {
    const ld = product({ name: 'X', url: 'https://x.com/p', price: 29, currency: 'gbp' });
    assert.equal(ld.offers.url, 'https://x.com/p');
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

/* ── Directory / sector builders ─────────────────────────────────────────────
 *
 * These assert Google's documented requirements, which are stricter than
 * Schema.org's. Schema.org marks nearly everything optional; Google silently
 * drops a rich result when a required property is missing, so "it validates"
 * is not the bar — "Google will render it" is.
 */

describe('localBusiness — sector subtypes', () => {
  it('defaults to LocalBusiness', () => {
    assert.equal(localBusiness({ name: 'X' })['@type'], 'LocalBusiness');
  });
  it('narrows to a sector subtype', () => {
    assert.equal(localBusiness({ name: 'X', type: 'Dentist' })['@type'], 'Dentist');
    assert.equal(localBusiness({ name: 'X', type: 'Restaurant' })['@type'], 'Restaurant');
    assert.equal(localBusiness({ name: 'X', type: 'AutoRepair' })['@type'], 'AutoRepair');
    assert.equal(localBusiness({ name: 'X', type: 'RealEstateAgent' })['@type'], 'RealEstateAgent');
    assert.equal(localBusiness({ name: 'X', type: 'MusicVenue' })['@type'], 'MusicVenue');
  });
  /* Google requires name; address is required for the local-business rich result
   * to place the entity at all. */
  it('keeps name and address, which Google requires', () => {
    const ld = localBusiness({ name: 'Smile', address: { streetAddress: '1 High St', addressLocality: 'Bristol' } });
    assert.equal(ld.name, 'Smile');
    assert.equal(ld.address['@type'], 'PostalAddress');
    assert.equal(ld.address.addressLocality, 'Bristol');
  });
});

describe('localBusiness — opening hours', () => {
  it('emits OpeningHoursSpecification', () => {
    const ld = localBusiness({ name: 'X', openingHours: { days: 'Monday', opens: '09:00', closes: '17:00' } });
    const [h] = ld.openingHoursSpecification;
    assert.equal(h['@type'], 'OpeningHoursSpecification');
    assert.deepEqual(h.dayOfWeek, ['Monday']);
    assert.equal(h.opens, '09:00');
    assert.equal(h.closes, '17:00');
  });
  it('normalises day abbreviations to schema.org names', () => {
    const ld = localBusiness({ name: 'X', openingHours: { days: ['mon', 'Tue', 'WED', 'thurs', 'fr', 'sa', 'su'] } });
    assert.deepEqual(ld.openingHoursSpecification[0].dayOfWeek,
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  });
  it('passes through a full schema.org day URL untouched', () => {
    const ld = localBusiness({ name: 'X', openingHours: { days: 'https://schema.org/Monday' } });
    assert.deepEqual(ld.openingHoursSpecification[0].dayOfWeek, ['https://schema.org/Monday']);
  });
  /* Google's convention: a closed day is 00:00–00:00. Omitting the day means
   * "unknown", which is a different claim. */
  it('marks a closed day as 00:00-00:00', () => {
    const ld = localBusiness({ name: 'X', openingHours: { days: 'Sunday', closed: true } });
    const [h] = ld.openingHoursSpecification;
    assert.equal(h.opens, '00:00');
    assert.equal(h.closes, '00:00');
  });
  it('accepts several entries', () => {
    const ld = localBusiness({ name: 'X', openingHours: [
      { days: ['Mon', 'Tue'], opens: '09:00', closes: '17:00' },
      { days: 'Sat', opens: '10:00', closes: '14:00' },
    ] });
    assert.equal(ld.openingHoursSpecification.length, 2);
  });
});

describe('localBusiness — restaurant fields', () => {
  it('carries cuisine, menu and reservations', () => {
    const ld = localBusiness({
      name: 'Trattoria', type: 'Restaurant',
      servesCuisine: ['Italian'], menu: 'https://x.com/menu', acceptsReservations: true,
    });
    assert.deepEqual(ld.servesCuisine, ['Italian']);
    assert.equal(ld.hasMenu, 'https://x.com/menu');
    assert.equal(ld.acceptsReservations, true);
  });
  it('keeps acceptsReservations:false rather than dropping it', () => {
    const ld = localBusiness({ name: 'X', acceptsReservations: false });
    assert.equal(ld.acceptsReservations, false);
  });
});

describe('itemList', () => {
  it('numbers positions from 1', () => {
    const ld = itemList({ items: ['https://x.com/a', 'https://x.com/b'] });
    assert.equal(ld['@type'], 'ItemList');
    assert.equal(ld.numberOfItems, 2);
    assert.equal(ld.itemListElement[0].position, 1);
    assert.equal(ld.itemListElement[1].position, 2);
  });
  it('treats URLs as url and bare strings as name', () => {
    const ld = itemList({ items: ['https://x.com/a', 'Plain Name'] });
    assert.equal(ld.itemListElement[0].url, 'https://x.com/a');
    assert.equal(ld.itemListElement[1].name, 'Plain Name');
  });
  it('nests full nodes and strips their @context', () => {
    const ld = itemList({ items: [localBusiness({ name: 'B', type: 'Dentist' })] });
    const { item } = ld.itemListElement[0];
    assert.equal(item['@type'], 'Dentist');
    assert.ok(!('@context' in item), 'nested node must not repeat @context');
  });
  /* Page 3 of an archive must not restart numbering, or Google reads it as a
   * competing list of the same items. */
  it('honours startPosition and totalItems for pagination', () => {
    const ld = itemList({ items: ['a', 'b'], startPosition: 41, totalItems: 220 });
    assert.equal(ld.itemListElement[0].position, 41);
    assert.equal(ld.numberOfItems, 220);
  });
});

describe('menu', () => {
  it('builds sections with items and prices', () => {
    const ld = menu({ name: 'Dinner', sections: [
      { name: 'Small plates', items: [{ name: 'Padrón peppers', price: 6.5, currency: 'gbp' }] },
    ] });
    assert.equal(ld['@type'], 'Menu');
    const section = ld.hasMenuSection[0];
    assert.equal(section['@type'], 'MenuSection');
    assert.ok(!('@context' in section));
    const item = section.hasMenuItem[0];
    assert.equal(item['@type'], 'MenuItem');
    assert.equal(item.offers.price, '6.5');
    assert.equal(item.offers.priceCurrency, 'GBP');
  });
  it('supports a flat menu with no sections', () => {
    const ld = menu({ items: [{ name: 'Coffee', price: 3, currency: 'gbp' }] });
    assert.equal(ld.hasMenuItem[0].name, 'Coffee');
  });
  it('expands diets to schema.org URLs', () => {
    const ld = menuItem({ name: 'Salad', suitableForDiet: ['VeganDiet'] });
    assert.deepEqual(ld.suitableForDiet, ['https://schema.org/VeganDiet']);
  });
  it('leaves an already-qualified diet URL alone', () => {
    const ld = menuItem({ name: 'Salad', suitableForDiet: ['https://schema.org/VeganDiet'] });
    assert.deepEqual(ld.suitableForDiet, ['https://schema.org/VeganDiet']);
  });
});

describe('realEstateListing', () => {
  it('separates the advert from the dwelling', () => {
    const ld = realEstateListing({
      name: '2-bed flat', price: 1450, currency: 'gbp', datePosted: '2026-08-01',
      accommodation: { type: 'Apartment', numberOfBedrooms: 2, floorSize: 68 },
    });
    assert.equal(ld['@type'], 'RealEstateListing');
    assert.equal(ld.datePosted, '2026-08-01');
    assert.equal(ld.offers.price, '1450');
    assert.equal(ld.about['@type'], 'Apartment');
    assert.equal(ld.about.numberOfBedrooms, 2);
    assert.ok(!('@context' in ld.about));
  });
  it('expresses floor size as a QuantitativeValue with a unit code', () => {
    const ld = accommodation({ floorSize: 68 });
    assert.equal(ld.floorSize['@type'], 'QuantitativeValue');
    assert.equal(ld.floorSize.value, 68);
    assert.equal(ld.floorSize.unitCode, 'MTK');
    assert.equal(accommodation({ floorSize: 700, floorSizeUnit: 'FTK' }).floorSize.unitCode, 'FTK');
  });
  it('maps amenities to LocationFeatureSpecification', () => {
    const ld = accommodation({ amenities: ['Parking', 'Garden'] });
    assert.equal(ld.amenityFeature[0]['@type'], 'LocationFeatureSpecification');
    assert.equal(ld.amenityFeature[0].name, 'Parking');
    assert.equal(ld.amenityFeature[0].value, true);
  });
  it('defaults the agent to a RealEstateAgent', () => {
    assert.equal(realEstateListing({ name: 'X', agent: 'Acme Lettings' }).provider['@type'], 'RealEstateAgent');
  });
});

describe('music', () => {
  it('builds a MusicGroup for a band, artist or DJ', () => {
    const ld = musicGroup({ name: 'Spindrift', genre: 'Ambient', sameAs: ['https://spindrift.bandcamp.com'] });
    assert.equal(ld['@type'], 'MusicGroup');
    assert.equal(ld.genre, 'Ambient');
    assert.deepEqual(ld.sameAs, ['https://spindrift.bandcamp.com']);
  });
  it('nests albums and their tracks', () => {
    const ld = musicGroup({ name: 'Spindrift', albums: [
      { name: 'Tidal', tracks: [{ name: 'Drift', duration: 'PT4M33S' }] },
    ] });
    const album = ld.album[0];
    assert.equal(album['@type'], 'MusicAlbum');
    assert.ok(!('@context' in album));
    assert.equal(album.track[0]['@type'], 'MusicRecording');
    assert.equal(album.track[0].duration, 'PT4M33S');
  });
  it('defaults a string artist to MusicGroup, not Person', () => {
    assert.equal(musicAlbum({ name: 'Tidal', artist: 'Spindrift' }).byArtist['@type'], 'MusicGroup');
    assert.equal(musicRecording({ name: 'Drift', artist: 'Spindrift' }).byArtist['@type'], 'MusicGroup');
  });
  it('qualifies albumProductionType as a schema.org URL', () => {
    assert.equal(musicAlbum({ name: 'X', albumProductionType: 'DJMixAlbum' }).albumProductionType,
      'https://schema.org/DJMixAlbum');
  });
  it('wraps audio as an AudioObject', () => {
    assert.equal(musicRecording({ name: 'D', audio: 'https://x.com/a.mp3' }).audio['@type'], 'AudioObject');
  });
});

describe('event — subtypes and gigs', () => {
  it('narrows to a subtype', () => {
    assert.equal(event({ name: 'Gig', startDate: '2026-09-01', type: 'MusicEvent' })['@type'], 'MusicEvent');
  });
  it('defaults a string performer to MusicGroup', () => {
    const ld = event({ name: 'Gig', startDate: '2026-09-01', type: 'MusicEvent', performer: 'Spindrift' });
    assert.equal(ld.performer[0]['@type'], 'MusicGroup');
  });
  /* Google requires eventStatus and eventAttendanceMode as absolute schema.org
   * URLs, not bare tokens. */
  it('qualifies status and attendance mode as URLs', () => {
    const ld = event({
      name: 'Gig', startDate: '2026-09-01',
      status: 'EventScheduled', attendanceMode: 'OfflineEventAttendanceMode',
    });
    assert.equal(ld.eventStatus, 'https://schema.org/EventScheduled');
    assert.equal(ld.eventAttendanceMode, 'https://schema.org/OfflineEventAttendanceMode');
  });
  it('attaches ticket pricing', () => {
    const ld = event({ name: 'Gig', startDate: '2026-09-01', price: 15, currency: 'gbp' });
    assert.equal(ld.offers.price, '15');
    assert.equal(ld.offers.priceCurrency, 'GBP');
  });
});

describe('organization — subtypes', () => {
  it('narrows to a subtype', () => {
    assert.equal(organization({ name: 'X', url: 'https://x.com', type: 'MusicGroup' })['@type'], 'MusicGroup');
    assert.equal(organization({ name: 'X', url: 'https://x.com', type: 'NGO' })['@type'], 'NGO');
  });
  it('carries contact details', () => {
    const ld = organization({ name: 'X', url: 'https://x.com', phone: '+44 117 000 0000', email: 'a@x.com', address: '1 High St' });
    assert.equal(ld.telephone, '+44 117 000 0000');
    assert.equal(ld.email, 'a@x.com');
    assert.equal(ld.address['@type'], 'PostalAddress');
  });
});

describe('buildGraph', () => {
  const nodes = () => [
    webSite({ name: 'Acme', url: 'https://acme.com' }),
    organization({ name: 'Acme Inc', url: 'https://acme.com' }),
    webPage({ name: 'Hello', url: 'https://acme.com/hello' }),
    article({ headline: 'Hello', url: 'https://acme.com/hello' }),
    breadcrumb([{ name: 'Home', url: 'https://acme.com' }, { name: 'Hello' }]),
  ];

  it('hoists one @context and drops the per-node ones', () => {
    const g = buildGraph(nodes());
    assert.equal(g['@context'], 'https://schema.org');
    assert.equal(g['@graph'].length, 5);
    for (const n of g['@graph']) assert.equal(n['@context'], undefined);
  });

  it('keys site entities on the origin and page entities on the page URL', () => {
    const [site, org, page] = buildGraph(nodes())['@graph'];
    assert.equal(site['@id'], 'https://acme.com#website');
    assert.equal(org['@id'], 'https://acme.com#organization');
    assert.equal(page['@id'], 'https://acme.com/hello#webpage');
  });

  it('cross-references the usual relationships', () => {
    const [site, , page, post] = buildGraph(nodes())['@graph'];
    assert.equal(site.publisher['@id'], 'https://acme.com#organization');
    assert.equal(page.isPartOf['@id'], 'https://acme.com#website');
    assert.equal(page.breadcrumb['@id'], 'https://acme.com/hello#breadcrumb');
    assert.equal(post.mainEntityOfPage['@id'], 'https://acme.com/hello#webpage');
    assert.equal(post.isPartOf['@id'], 'https://acme.com/hello#webpage');
    assert.equal(post.publisher['@id'], 'https://acme.com#organization');
  });

  it('links the author when a Person is in the graph', () => {
    const g = buildGraph([
      personLd({ name: 'Jane', url: 'https://acme.com/jane' }),
      webPage({ name: 'Hello', url: 'https://acme.com/hello' }),
      article({ headline: 'Hello', url: 'https://acme.com/hello' }),
    ]);
    const post = g['@graph'].find((n) => n['@type'] === 'Article');
    assert.equal(post.author['@id'], 'https://acme.com#person');
  });

  it('never overwrites a value the caller set explicitly', () => {
    const g = buildGraph([
      organization({ name: 'Acme Inc', url: 'https://acme.com' }),
      article({ headline: 'H', url: 'https://acme.com/h', publisher: 'Someone Else' }),
    ]);
    const post = g['@graph'].find((n) => n['@type'] === 'Article');
    assert.equal(post.publisher.name, 'Someone Else');
    assert.equal(post.publisher['@id'], undefined);
  });

  it('respects an @id the caller already assigned', () => {
    const g = buildGraph([{ '@context': 'https://schema.org', '@type': 'WebSite', '@id': 'urn:site', name: 'X' }]);
    assert.equal(g['@graph'][0]['@id'], 'urn:site');
  });

  it('sets about on the homepage only', () => {
    const home = buildGraph([
      webSite({ name: 'Acme', url: 'https://acme.com' }),
      organization({ name: 'Acme Inc', url: 'https://acme.com' }),
      webPage({ name: 'Home', url: 'https://acme.com' }),
    ])['@graph'].find((n) => n['@type'] === 'WebPage');
    assert.equal(home.about['@id'], 'https://acme.com#organization');

    const inner = buildGraph(nodes())['@graph'].find((n) => n['@type'] === 'WebPage');
    assert.equal(inner.about, undefined);
  });

  it('prefers an exact WebPage over a subtype as the page node', () => {
    const g = buildGraph([
      faq([{ question: 'Q', answer: 'A' }]),
      webPage({ name: 'Help', url: 'https://acme.com/help' }),
      webSite({ name: 'Acme', url: 'https://acme.com' }),
    ]);
    const page = g['@graph'].find((n) => n['@type'] === 'WebPage');
    const faqNode = g['@graph'].find((n) => n['@type'] === 'FAQPage');
    assert.equal(page.isPartOf['@id'], 'https://acme.com#website');
    assert.equal(faqNode.isPartOf, undefined);
  });

  it('suffixes a repeated type rather than colliding', () => {
    const g = buildGraph([
      personLd({ name: 'Jane' }),
      personLd({ name: 'John' }),
    ], { origin: 'https://acme.com' });
    assert.equal(g['@graph'][0]['@id'], 'https://acme.com#person');
    assert.equal(g['@graph'][1]['@id'], 'https://acme.com#person-2');
  });

  it('falls back to bare fragments when there are no URLs at all', () => {
    const g = buildGraph([webSite({ name: 'X' }), webPage({ name: 'Y' })]);
    assert.equal(g['@graph'][0]['@id'], '#website');
    assert.equal(g['@graph'][1].isPartOf['@id'], '#website');
  });

  /* validate/schema.ts type-checks a hand-written graph against schema-dts.
   * That proves the *shape* is legal Schema.org; it does not prove the builder
   * emits it. This asserts the real output carries exactly the @ids and
   * references that the validated sample declares. */
  it('emits the same references the schema-dts sample validates', () => {
    const g = buildGraph([
      webSite({ name: 'W', url: 'https://x.com' }),
      organization({ name: 'O', url: 'https://x.com' }),
      personLd({ name: 'J' }),
      webPage({ name: 'P', url: 'https://x.com/p' }),
      article({ headline: 'H', url: 'https://x.com/p' }),
      breadcrumb([{ name: 'Home', url: 'https://x.com' }, { name: 'P' }]),
    ]);
    const byType = Object.fromEntries(g['@graph'].map((n) => [n['@type'], n]));
    assert.deepEqual(
      g['@graph'].map((n) => n['@id']),
      [
        'https://x.com#website',
        'https://x.com#organization',
        'https://x.com#person',
        'https://x.com/p#webpage',
        'https://x.com/p#article',
        'https://x.com/p#breadcrumb',
      ],
    );
    assert.deepEqual(byType.WebSite.publisher, { '@id': 'https://x.com#organization' });
    assert.deepEqual(byType.WebPage.isPartOf, { '@id': 'https://x.com#website' });
    assert.deepEqual(byType.WebPage.breadcrumb, { '@id': 'https://x.com/p#breadcrumb' });
    assert.deepEqual(byType.Article.isPartOf, { '@id': 'https://x.com/p#webpage' });
    assert.deepEqual(byType.Article.mainEntityOfPage, { '@id': 'https://x.com/p#webpage' });
    assert.deepEqual(byType.Article.publisher, { '@id': 'https://x.com#organization' });
    assert.deepEqual(byType.Article.author, { '@id': 'https://x.com#person' });
  });

  it('strips a fragment off the supplied url', () => {
    const g = buildGraph([webPage({ name: 'Y', url: 'https://acme.com/y#top' })]);
    assert.equal(g['@graph'][0]['@id'], 'https://acme.com/y#webpage');
  });
});
