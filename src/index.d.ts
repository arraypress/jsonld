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
  name: string; url: string; offerUrl?: string; description?: string; image?: string | string[]; sku?: string; brand?: Node;
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

export interface OrganizationOptions extends Extra {
  name: string; type?: OrganizationType; url: string; logo?: string;
  description?: string; sameAs?: string[]; address?: Node; phone?: string; email?: string;
}
export function organization(options: OrganizationOptions): object;

// ── Site structure ──
export interface WebSiteOptions extends Extra { name: string; url: string; searchUrl?: string; }
export function webSite(options: WebSiteOptions): object;

export interface WebPageOptions extends Extra { name: string; url: string; description?: string; primaryImage?: string; datePublished?: string; dateModified?: string; }
export function webPage(options: WebPageOptions): object;

export interface ProfilePageOptions extends Extra { mainEntity: PersonOptions | object; url?: string; dateCreated?: string; dateModified?: string; }
export function profilePage(options: ProfilePageOptions): object;

export interface DefinedTermSetRef { name: string; url?: string; }
export interface DefinedTermOptions extends Extra { name: string; description?: string; url?: string; termCode?: string; inSet?: DefinedTermSetRef; }
export function definedTerm(options: DefinedTermOptions): object;

export interface QuizOptions extends Extra { name: string; url?: string; description?: string; numberOfQuestions?: number; about?: string; provider?: OrganizationOptions | object; }
export function quiz(options: QuizOptions): object;

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
export interface EventOptions extends Extra {
  name: string; type?: EventType; url?: string; startDate: string; endDate?: string;
  location?: Node; description?: string; image?: string | string[]; organizer?: Node;
  performer?: string | object | Array<string | object>;
  price?: number | string; currency?: string; offerUrl?: string;
  status?: 'EventScheduled' | 'EventCancelled' | 'EventMovedOnline' | 'EventPostponed' | 'EventRescheduled';
  attendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
}
export function event(options: EventOptions): object;

export interface LocalBusinessOptions extends Extra {
  name: string; type?: LocalBusinessType; url?: string; address?: Node; phone?: string;
  email?: string; image?: string | string[]; priceRange?: string;
  rating?: number; reviewCount?: number; geo?: { latitude: number; longitude: number };
  openingHours?: OpeningHoursEntry | OpeningHoursEntry[];
  servesCuisine?: string[]; menu?: string; acceptsReservations?: boolean;
}
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

/* ── Sector type unions ─────────────────────────────────────────────────────
 *
 * Schema.org's LocalBusiness tree is how one directory codebase serves every
 * vertical. These unions are the tree as published, so `type` is checked at
 * compile time rather than guessed — a typo like 'Dentistry' would otherwise
 * ship silently and Google would ignore the entity.
 *
 * Anything missing is still reachable via `extra: { '@type': '…' }`.
 */

/** Automotive — garages, dealers, hire, parts, fuel. */
export type AutomotiveType =
  | 'AutomotiveBusiness' | 'AutoBodyShop' | 'AutoDealer' | 'AutoPartsStore'
  | 'AutoRental' | 'AutoRepair' | 'AutoWash' | 'GasStation'
  | 'MotorcycleDealer' | 'MotorcycleRepair';

/** Medical and dental practices. */
export type MedicalType =
  | 'MedicalBusiness' | 'MedicalClinic' | 'Dentist' | 'Physician' | 'Pharmacy'
  | 'Optician' | 'Optometric' | 'Dermatology' | 'DietNutrition' | 'Emergency'
  | 'Geriatric' | 'Gynecologic' | 'Midwifery' | 'Nursing' | 'Obstetric'
  | 'Oncologic' | 'Otolaryngologic' | 'Pediatric' | 'Physiotherapy'
  | 'PlasticSurgery' | 'Podiatric' | 'PrimaryCare' | 'Psychiatric'
  | 'PublicHealth' | 'CommunityHealth' | 'Hospital' | 'VeterinaryCare';

/** Food and drink venues. */
export type FoodType =
  | 'FoodEstablishment' | 'Restaurant' | 'CafeOrCoffeeShop' | 'BarOrPub'
  | 'Bakery' | 'Brewery' | 'Distillery' | 'Winery' | 'FastFoodRestaurant'
  | 'IceCreamShop';

/** Health, beauty and fitness. */
export type HealthBeautyType =
  | 'HealthAndBeautyBusiness' | 'BeautySalon' | 'DaySpa' | 'HairSalon'
  | 'NailSalon' | 'TattooParlor' | 'HealthClub';

/** Trades and construction. */
export type TradesType =
  | 'HomeAndConstructionBusiness' | 'Electrician' | 'GeneralContractor'
  | 'HVACBusiness' | 'HousePainter' | 'Locksmith' | 'MovingCompany'
  | 'Plumber' | 'RoofingContractor';

/** Professional and financial services. */
export type ProfessionalType =
  | 'ProfessionalService' | 'LegalService' | 'Attorney' | 'Notary'
  | 'FinancialService' | 'AccountingService' | 'BankOrCreditUnion'
  | 'InsuranceAgency' | 'AutomatedTeller' | 'EmploymentAgency'
  | 'TravelAgency' | 'RealEstateAgent' | 'Dentist';

/** Nightlife, arts and entertainment. */
export type EntertainmentType =
  | 'EntertainmentBusiness' | 'NightClub' | 'ArtGallery' | 'AmusementPark'
  | 'Casino' | 'ComedyClub' | 'MovieTheater' | 'AdultEntertainment'
  | 'MusicVenue' | 'PerformingArtsTheater';

/** Sport and leisure venues. */
export type SportsType =
  | 'SportsActivityLocation' | 'SportsClub' | 'ExerciseGym' | 'BowlingAlley'
  | 'GolfCourse' | 'PublicSwimmingPool' | 'SkiResort' | 'StadiumOrArena'
  | 'TennisComplex';

/** Accommodation providers. */
export type LodgingType =
  | 'LodgingBusiness' | 'Hotel' | 'Motel' | 'Hostel' | 'BedAndBreakfast'
  | 'Campground' | 'Resort';

/** Retail. */
export type StoreType =
  | 'Store' | 'BikeStore' | 'BookStore' | 'ClothingStore' | 'ComputerStore'
  | 'ConvenienceStore' | 'DepartmentStore' | 'ElectronicsStore' | 'Florist'
  | 'FurnitureStore' | 'GardenStore' | 'GroceryStore' | 'HardwareStore'
  | 'HobbyShop' | 'HomeGoodsStore' | 'JewelryStore' | 'LiquorStore'
  | 'MensClothingStore' | 'MobilePhoneStore' | 'MovieRentalStore'
  | 'MusicStore' | 'OfficeEquipmentStore' | 'OutletStore' | 'PawnShop'
  | 'PetStore' | 'ShoeStore' | 'SportingGoodsStore' | 'TireShop' | 'ToyStore'
  | 'WholesaleStore' | 'ShoppingCenter';

/** Public, civic and everything else in the tree. */
export type OtherLocalBusinessType =
  | 'LocalBusiness' | 'AnimalShelter' | 'ArchiveOrganization' | 'ChildCare'
  | 'DryCleaningOrLaundry' | 'EmergencyService' | 'FireStation'
  | 'PoliceStation' | 'GovernmentOffice' | 'PostOffice' | 'InternetCafe'
  | 'Library' | 'RadioStation' | 'TelevisionStation' | 'RecyclingCenter'
  | 'SelfStorage' | 'TouristInformationCenter' | 'Church' | 'Place';

/** Every LocalBusiness subtype — what `localBusiness({ type })` accepts. */
export type LocalBusinessType =
  | AutomotiveType | MedicalType | FoodType | HealthBeautyType | TradesType
  | ProfessionalType | EntertainmentType | SportsType | LodgingType
  | StoreType | OtherLocalBusinessType;

/** Organization subtypes — what `organization({ type })` accepts. */
export type OrganizationType =
  | 'Organization' | 'Corporation' | 'NGO' | 'GovernmentOrganization'
  | 'EducationalOrganization' | 'CollegeOrUniversity' | 'ElementarySchool'
  | 'HighSchool' | 'MiddleSchool' | 'Preschool' | 'School'
  | 'MusicGroup' | 'PerformingGroup' | 'DanceGroup' | 'TheaterGroup'
  | 'SportsOrganization' | 'SportsTeam' | 'NewsMediaOrganization'
  | 'MedicalOrganization' | 'Project' | 'FundingScheme' | 'Consortium'
  | 'LibrarySystem' | 'WorkersUnion' | 'Airline';

/** Event subtypes — what `event({ type })` accepts. */
export type EventType =
  | 'Event' | 'MusicEvent' | 'Festival' | 'BusinessEvent' | 'ChildrensEvent'
  | 'ComedyEvent' | 'CourseInstance' | 'DanceEvent' | 'DeliveryEvent'
  | 'EducationEvent' | 'ExhibitionEvent' | 'FoodEvent' | 'Hackathon'
  | 'LiteraryEvent' | 'PublicationEvent' | 'SaleEvent' | 'ScreeningEvent'
  | 'SocialEvent' | 'SportsEvent' | 'TheaterEvent' | 'VisualArtsEvent';

/** Accommodation subtypes — what `accommodation({ type })` accepts. */
export type AccommodationType =
  | 'Accommodation' | 'Apartment' | 'House' | 'SingleFamilyResidence'
  | 'Room' | 'HotelRoom' | 'MeetingRoom' | 'Suite' | 'CampingPitch' | 'Residence';

/* ── New builders ───────────────────────────────────────────────────────── */

export interface OpeningHoursEntry {
  /** Day or days. Accepts 'Mon', 'monday', 'Monday', or a schema.org URL. */
  days?: string | string[];
  /** 24-hour local time, e.g. '09:00'. */
  opens?: string;
  /** 24-hour local time, e.g. '17:30'. */
  closes?: string;
  /** Marks the day explicitly closed (emitted as 00:00–00:00). */
  closed?: boolean;
  validFrom?: string;
  validThrough?: string;
}

export interface ItemListOptions extends Extra {
  items: Array<string | object>;
  name?: string;
  url?: string;
  order?: 'ItemListOrderAscending' | 'ItemListOrderDescending' | 'ItemListUnordered';
  startPosition?: number;
  totalItems?: number;
}
export function itemList(options: ItemListOptions): object;

export interface MenuItemOptions extends Extra {
  name: string; description?: string; price?: number | string; currency?: string;
  suitableForDiet?: string | string[]; calories?: number;
}
export function menuItem(options: MenuItemOptions): object;

export interface MenuSectionOptions extends Extra {
  name: string; items?: MenuItemOptions[]; description?: string;
}
export function menuSection(options: MenuSectionOptions): object;

export interface MenuOptions extends Extra {
  name?: string; url?: string; description?: string;
  sections?: MenuSectionOptions[]; items?: MenuItemOptions[];
}
export function menu(options: MenuOptions): object;

export interface AccommodationOptions extends Extra {
  type?: AccommodationType; name?: string;
  numberOfBedrooms?: number; numberOfBathroomsTotal?: number; numberOfRooms?: number;
  floorSize?: number; floorSizeUnit?: string; address?: Node; geo?: { latitude: number; longitude: number };
  amenities?: Array<string | object>; yearBuilt?: number;
}
export function accommodation(options: AccommodationOptions): object;

export interface RealEstateListingOptions extends Extra {
  name: string; url?: string; description?: string; image?: string | string[];
  price?: number | string; currency?: string; datePosted?: string;
  address?: Node; geo?: { latitude: number; longitude: number };
  accommodation?: AccommodationOptions; agent?: string | object;
}
export function realEstateListing(options: RealEstateListingOptions): object;

export interface MusicRecordingOptions extends Extra {
  name: string; artist?: string | object; url?: string; duration?: string;
  album?: string | object; audio?: string; isrc?: string;
}
export function musicRecording(options: MusicRecordingOptions): object;

export interface MusicAlbumOptions extends Extra {
  name: string; artist?: string | object; url?: string; image?: string | string[];
  releaseDate?: string; genre?: string; numTracks?: number;
  tracks?: MusicRecordingOptions[];
  albumProductionType?: 'StudioAlbum' | 'CompilationAlbum' | 'DJMixAlbum'
    | 'DemoAlbum' | 'LiveAlbum' | 'MixtapeAlbum' | 'RemixAlbum' | 'SoundtrackAlbum'
    | 'SpokenWordAlbum';
  price?: number | string; currency?: string;
}
export function musicAlbum(options: MusicAlbumOptions): object;

export interface MusicGroupOptions extends Extra {
  name: string; url?: string; image?: string | string[]; description?: string;
  genre?: string; sameAs?: string[]; members?: Array<string | object>;
  foundingDate?: string; foundingLocation?: string | object;
  albums?: MusicAlbumOptions[];
}
export function musicGroup(options: MusicGroupOptions): object;
