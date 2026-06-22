/**
 * @arraypress/jsonld — TypeScript definitions.
 *
 * Every builder returns a complete object with `@context`, and accepts an
 * `extra` field (merged last) for Schema.org properties it doesn't model.
 */

/** Caller-supplied Schema.org fields merged last. */
type Extra = { extra?: Record<string, unknown> };
type Node = string | object;

// ── Commerce ──
export interface ReviewOptions extends Extra { rating: number; author?: Node; body?: string; datePublished?: string; bestRating?: number; }
export interface AggregateRatingOptions extends Extra { rating: number; reviewCount: number; bestRating?: number; }
export interface OfferOptions extends Extra { price?: number | string; currency?: string; url?: string; availability?: string; priceValidUntil?: string; }
export interface ProductOptions extends Extra {
  name: string; url: string; description?: string; image?: string | string[]; sku?: string; brand?: Node;
  price?: number | string; currency?: string; availability?: string; priceValidUntil?: string;
  rating?: number; reviewCount?: number;
  reviews?: Array<{ rating: number; author?: Node; body?: string; datePublished?: string }>;
  additionalProperty?: Array<{ name: string; value: string | number }>;
}
export function product(options: ProductOptions): object;
export function offer(options: OfferOptions): object;
export function review(options: ReviewOptions): object;
export function aggregateRating(options: AggregateRatingOptions): object;

// ── Content ──
export interface ArticleOptions extends Extra {
  headline: string; url: string; description?: string; image?: string | string[];
  datePublished?: string; dateModified?: string; author?: Node; publisher?: Node;
  section?: string; keywords?: string[];
}
export function article(options: ArticleOptions): object;
export function blogPosting(options: ArticleOptions): object;
export function newsArticle(options: ArticleOptions): object;

export interface RecipeOptions extends Extra {
  name: string; image?: string | string[]; author?: Node; description?: string; datePublished?: string;
  ingredients?: string[]; instructions?: string[]; prepTime?: string; cookTime?: string; totalTime?: string; recipeYield?: string;
}
export function recipe(options: RecipeOptions): object;

export interface VideoObjectOptions extends Extra { name: string; description: string; thumbnailUrl: string; uploadDate: string; contentUrl?: string; embedUrl?: string; duration?: string; }
export function videoObject(options: VideoObjectOptions): object;

export interface ImageObjectOptions extends Extra { url: string; width?: number; height?: number; caption?: string; }
export function imageObject(options: ImageObjectOptions): object;

// ── Entities ──
export interface PersonOptions extends Extra { name: string; url?: string; image?: string; jobTitle?: string; description?: string; email?: string; worksFor?: Node; sameAs?: string[]; }
export function person(options: PersonOptions): object;

export interface OrganizationOptions extends Extra { name: string; url: string; logo?: string; description?: string; sameAs?: string[]; }
export function organization(options: OrganizationOptions): object;

// ── Site structure ──
export interface WebSiteOptions extends Extra { name: string; url: string; searchUrl?: string; }
export function webSite(options: WebSiteOptions): object;

export interface WebPageOptions extends Extra { name: string; url: string; description?: string; primaryImage?: string; datePublished?: string; dateModified?: string; }
export function webPage(options: WebPageOptions): object;

export interface ProfilePageOptions extends Extra { mainEntity: PersonOptions | object; url?: string; dateCreated?: string; dateModified?: string; }
export function profilePage(options: ProfilePageOptions): object;

export interface BreadcrumbItem { name: string; url?: string; }
export function breadcrumb(items: BreadcrumbItem[]): object;

export interface FAQItem { question: string; answer: string; }
export function faq(items: FAQItem[]): object;

export interface HowToStep { name: string; text: string; url?: string; image?: string; }
export interface HowToOptions extends Extra { name: string; description?: string; steps?: HowToStep[]; totalTime?: string; }
export function howTo(options: HowToOptions): object;

export interface CollectionPageOptions extends Extra { name: string; url: string; description?: string; provider?: Node; }
export function collectionPage(options: CollectionPageOptions): object;

// ── Local / business / careers / learning ──
export interface EventOptions extends Extra { name: string; url?: string; startDate: string; endDate?: string; location?: Node; description?: string; image?: string; organizer?: Node; }
export function event(options: EventOptions): object;

export interface LocalBusinessOptions extends Extra { name: string; url?: string; address?: Node; phone?: string; image?: string; priceRange?: string; rating?: number; reviewCount?: number; geo?: { latitude: number; longitude: number }; }
export function localBusiness(options: LocalBusinessOptions): object;

export interface JobPostingOptions extends Extra {
  title: string; description: string; datePosted: string; hiringOrganization: Node;
  url?: string; validThrough?: string; employmentType?: string; jobLocation?: string | object;
  remote?: boolean; salary?: number | string; currency?: string; salaryUnit?: string;
}
export function jobPosting(options: JobPostingOptions): object;

export interface SoftwareApplicationOptions extends Extra { name: string; url?: string; description?: string; operatingSystem?: string; category?: string; price?: number | string; currency?: string; rating?: number; reviewCount?: number; }
export function softwareApplication(options: SoftwareApplicationOptions): object;

export interface CourseOptions extends Extra { name: string; description: string; provider?: Node; url?: string; }
export function course(options: CourseOptions): object;

export interface ServiceOptions extends Extra { name: string; description?: string; provider?: Node; serviceType?: string; areaServed?: string; url?: string; }
export function service(options: ServiceOptions): object;
