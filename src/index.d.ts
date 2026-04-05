export interface ProductOptions { name: string; url: string; description?: string; image?: string; sku?: string; brand?: string; price?: number; currency?: string; availability?: string; rating?: number; reviewCount?: number; }
export function product(options: ProductOptions): object;

export interface ArticleOptions { headline: string; url: string; description?: string; image?: string; datePublished?: string; dateModified?: string; author?: string | object; publisher?: string | object; }
export function article(options: ArticleOptions): object;
export function blogPosting(options: ArticleOptions): object;

export interface OrganizationOptions { name: string; url: string; logo?: string; description?: string; sameAs?: string[]; }
export function organization(options: OrganizationOptions): object;

export interface WebSiteOptions { name: string; url: string; searchUrl?: string; }
export function webSite(options: WebSiteOptions): object;

export interface BreadcrumbItem { name: string; url?: string; }
export function breadcrumb(items: BreadcrumbItem[]): object;

export interface FAQItem { question: string; answer: string; }
export function faq(items: FAQItem[]): object;

export interface HowToStep { name: string; text: string; url?: string; image?: string; }
export interface HowToOptions { name: string; description?: string; steps?: HowToStep[]; totalTime?: string; }
export function howTo(options: HowToOptions): object;

export interface EventOptions { name: string; url?: string; startDate: string; endDate?: string; location?: string | object; description?: string; image?: string; organizer?: string | object; }
export function event(options: EventOptions): object;

export interface LocalBusinessOptions { name: string; url?: string; address?: string | object; phone?: string; image?: string; priceRange?: string; rating?: number; reviewCount?: number; geo?: { latitude: number; longitude: number }; }
export function localBusiness(options: LocalBusinessOptions): object;

export interface SoftwareApplicationOptions { name: string; url?: string; description?: string; operatingSystem?: string; category?: string; price?: number; currency?: string; rating?: number; reviewCount?: number; }
export function softwareApplication(options: SoftwareApplicationOptions): object;

export interface CollectionPageOptions { name: string; url: string; description?: string; provider?: string | object; }
export function collectionPage(options: CollectionPageOptions): object;
