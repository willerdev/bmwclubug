import type {
  BMWModel,
  ClubStats,
  DrivingRoute,
  Event,
  ForumPost,
  GalleryItem,
  Garage,
  MarketplaceListing,
  Member,
  MembershipLevel,
  Partner,
  ShopProduct,
  Testimonial,
  Vehicle,
} from "@/types";
import { BMW_IMAGES, LOCAL_IMAGES, MEMBERSHIP_LEVELS, UGANDAN_DISTRICTS } from "@/lib/constants";
import { buildRealMembers, REAL_MEMBER_COUNT } from "./realMembers";

const FIRST_NAMES = [
  "James", "Sarah", "David", "Grace", "Peter", "Mary", "John", "Ruth",
  "Michael", "Patricia", "Robert", "Elizabeth", "Daniel", "Susan", "Paul",
  "Margaret", "Joseph", "Catherine", "Samuel", "Joyce", "Andrew", "Nancy",
  "Emmanuel", "Rebecca", "Francis", "Helen", "Charles", "Dorothy", "Henry",
  "Christine", "Richard", "Alice", "Thomas", "Jane", "William", "Rose",
  "Patrick", "Esther", "Stephen", "Florence", "Brian", "Agnes", "Eric",
  "Betty", "Ivan", "Diana", "Ronald", "Caroline", "Geoffrey", "Lydia",
];

const LAST_NAMES = [
  "Mukasa", "Nalubega", "Okello", "Namukasa", "Ssempijja", "Nakato",
  "Kato", "Nabukeera", "Mugisha", "Nansubuga", "Ochieng", "Akello",
  "Ssemwogerere", "Nabirye", "Wasswa", "Nalwoga", "Otim", "Apio",
  "Kiggundu", "Nabukenya", "Lubega", "Nakimera", "Byaruhanga", "Nalubwama",
  "Ssebunya", "Nakayiza", "Mbabazi", "Nalubega", "Tumwine", "Nabukeera",
];

const BMW_MODELS = [
  "320i", "325i", "328i", "330i", "335i", "520i", "525i", "530i", "540i",
  "M2", "M3", "M4", "M5", "X3", "X5", "X6", "118i", "120i", "218i", "420i",
];

const GENERATIONS = ["E30", "E36", "E46", "E39", "E60", "F30", "G20", "G30", "F80", "G80"];

const BADGES = [
  "Road Warrior", "Track Day Hero", "Community Leader", "Photography Pro",
  "Charity Champion", "Long Distance Driver", "Restoration Expert", "M Enthusiast",
  "Event Organizer", "Mentor", "Safety Advocate", "Vintage Collector",
];

const FORUM_CATEGORIES = [
  "Mechanical Advice", "Buying Tips", "BMW Projects", "Events",
  "Road Trips", "Photography", "Marketplace", "General Discussion",
];

const MARKETPLACE_CATEGORIES = [
  "BMW Cars", "Spare Parts", "Wheels", "Tyres", "Performance Parts",
  "Interior Accessories", "Detailing Products", "Merchandise",
];

const GARAGE_SERVICES = [
  "Engine Diagnostics", "Oil Change", "Brake Service", "Suspension",
  "Electrical", "Body Work", "Paint", "Detailing", "Performance Tuning",
  "Transmission", "AC Service", "Wheel Alignment",
];

function pick<T>(arr: readonly T[] | T[], i: number): T {
  return arr[i % arr.length];
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const CLUB_PHOTO_POOL = [
  ...LOCAL_IMAGES.m4,
  ...LOCAL_IMAGES.m8,
  ...LOCAL_IMAGES.cars,
  ...LOCAL_IMAGES.events,
] as const;

function clubPhoto(id: number): string {
  return CLUB_PHOTO_POOL[id % CLUB_PHOTO_POOL.length];
}

function eventPhoto(id: number): string {
  const pool = [...LOCAL_IMAGES.events, ...LOCAL_IMAGES.cars];
  return pool[id % pool.length];
}

/** @deprecated kept as alias while migrating call sites */
function unsplashBMW(id: number, _w = 800): string {
  return clubPhoto(id);
}

function avatarUrl(id: number): string {
  return `https://i.pravatar.cc/300?img=${(id % 70) + 1}`;
}

export function generateMembers(count = 150): Member[] {
  const rand = seededRandom(42);
  return Array.from({ length: count }, (_, i) => {
    const first = pick(FIRST_NAMES, i);
    const last = pick(LAST_NAMES, i + 7);
    const level = pick(MEMBERSHIP_LEVELS, Math.floor(rand() * 6)) as MembershipLevel;
    const numCars = 1 + Math.floor(rand() * 3);
    const cars = Array.from({ length: numCars }, (_, j) =>
      `${pick(GENERATIONS, i + j)} ${pick(BMW_MODELS, i + j)}`
    );
    return {
      id: `member-${i + 1}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@email.ug`,
      photo: avatarUrl(i),
      bio: `Passionate BMW enthusiast from ${pick(UGANDAN_DISTRICTS, i)}. ${numCars > 1 ? "Multi-BMW owner" : "Proud owner"} with ${Math.floor(rand() * 15) + 1} years of driving experience. Love exploring Uganda's scenic routes.`,
      district: pick(UGANDAN_DISTRICTS, i),
      membershipLevel: level,
      yearsInClub: Math.floor(rand() * 8) + 1,
      rank: level === "Founder" ? "Founding Member" : level === "Executive Committee" ? "Committee" : "Active Member",
      badges: Array.from({ length: 2 + Math.floor(rand() * 4) }, (_, j) => pick(BADGES, i + j)),
      favoriteRoute: `${pick(UGANDAN_DISTRICTS, i)} → ${pick(UGANDAN_DISTRICTS, i + 3)}`,
      cars,
      garage: rand() > 0.5 ? `Personal Garage - ${pick(UGANDAN_DISTRICTS, i)}` : undefined,
      social: {
        instagram: `@${first.toLowerCase()}_bmw`,
        twitter: rand() > 0.5 ? `@${first.toLowerCase()}ug` : undefined,
      },
      friends: Array.from({ length: 3 + Math.floor(rand() * 5) }, (_, j) => `member-${((i + j + 1) % count) + 1}`),
      awards: rand() > 0.6 ? [pick(BADGES, i), pick(BADGES, i + 2)] : [],
      eventHistory: Array.from({ length: 2 + Math.floor(rand() * 8) }, (_, j) => `event-${((i + j) % 30) + 1}`),
      gallery: Array.from({ length: 3 + Math.floor(rand() * 5) }, (_, j) => unsplashBMW(i + j)),
    };
  });
}

export function generateVehicles(count = 80, members: Member[]): Vehicle[] {
  const rand = seededRandom(99);
  return Array.from({ length: count }, (_, i) => {
    const owner = pick(members, i);
    const gen = pick(GENERATIONS, i);
    const model = pick(BMW_MODELS, i);
    return {
      id: `vehicle-${i + 1}`,
      model,
      generation: gen,
      year: 1990 + Math.floor(rand() * 34),
      ownerId: owner.id,
      ownerName: owner.name,
      image: clubPhoto(i),
      engine: pick(["2.0L I4", "3.0L I6", "4.4L V8", "3.0L Twin Turbo", "2.0L Twin Turbo"], i),
      color: pick(["Alpine White", "Black Sapphire", "Mineral Grey", "Estoril Blue", "Melbourne Red", "San Marino Blue"], i),
    };
  });
}

export const bmwModels: BMWModel[] = [
  { id: "e30", name: "E30", generation: "E30", year: "1982-1994", engine: "2.5L I6", horsepower: 168, image: BMW_IMAGES.e30, owner: "Felix" },
  { id: "e36", name: "E36", generation: "E36", year: "1990-2000", engine: "2.8L I6", horsepower: 193, image: BMW_IMAGES.e36, owner: "Chris" },
  { id: "e46", name: "E46", generation: "E46", year: "1998-2006", engine: "3.0L I6", horsepower: 225, image: BMW_IMAGES.e46, owner: "Fort 2.0" },
  { id: "e39", name: "E39", generation: "E39", year: "1995-2004", engine: "4.4L V8", horsepower: 282, image: BMW_IMAGES.e39, owner: "Enock Onzoma" },
  { id: "e60", name: "E60", generation: "E60", year: "2003-2010", engine: "3.0L I6", horsepower: 255, image: BMW_IMAGES.e60, owner: "Emmanuel" },
  { id: "f30", name: "F30", generation: "F30", year: "2012-2019", engine: "2.0L Turbo", horsepower: 248, image: BMW_IMAGES.f30, owner: "EKO S Auto Centre Ltd" },
  { id: "g20", name: "G20", generation: "G20", year: "2019-Present", engine: "2.0L Turbo", horsepower: 255, image: BMW_IMAGES.g20, owner: "Willer Fx" },
  { id: "m2", name: "M2", generation: "F87", year: "2016-2021", engine: "3.0L Twin Turbo", horsepower: 405, image: BMW_IMAGES.m2, owner: "Swift Shark" },
  { id: "m3", name: "M3", generation: "G80", year: "2021-Present", engine: "3.0L Twin Turbo", horsepower: 503, image: BMW_IMAGES.m3, owner: "Reda" },
  { id: "m4", name: "M4", generation: "G82", year: "2021-Present", engine: "3.0L Twin Turbo", horsepower: 503, image: BMW_IMAGES.m4, owner: "Phoenix" },
  { id: "m5", name: "M5", generation: "F90", year: "2018-Present", engine: "4.4L Twin Turbo", horsepower: 617, image: BMW_IMAGES.m5, owner: "Powell" },
  { id: "x3", name: "X3", generation: "G01", year: "2018-Present", engine: "2.0L Turbo", horsepower: 248, image: BMW_IMAGES.x3, owner: "Mutyaba Elijah" },
  { id: "x5", name: "X5", generation: "G05", year: "2019-Present", engine: "3.0L Turbo", horsepower: 335, image: BMW_IMAGES.x5, owner: "Salman Motors" },
  { id: "x6", name: "X6", generation: "G06", year: "2020-Present", engine: "3.0L Turbo", horsepower: 335, image: BMW_IMAGES.x6, owner: "Denno" },
  { id: "xm", name: "XM", generation: "G09", year: "2023-Present", engine: "4.4L V8 Hybrid", horsepower: 644, image: BMW_IMAGES.xm, owner: "Transporter 1" },
];

const EVENT_TITLES = [
  "Kampala Cars & Coffee", "Entebbe Sunset Cruise", "Jinja Road Trip",
  "Sipi Falls Drive", "Queen Elizabeth National Park Tour", "Track Experience Day",
  "Charity Drive", "BMW Photography Meet", "Mbarara Highlands Run",
  "Fort Portal Scenic Drive", "Lake Victoria Circuit", "Gulu Northern Expedition",
  "Mbale Mountain Pass", "Kabale Border Run", "Masaka Heritage Drive",
  "Wakiso Weekend Cruise", "Mukono Meet & Greet", "Arua Desert Challenge",
  "Club Anniversary Gala", "Winter Charity Convoy", "New Year Sunrise Drive",
  "Easter Family Meet", "Independence Day Parade", "End of Year Banquet",
  "M Performance Day", "Vintage BMW Showcase", "Ladies Drive Day",
  "Youth Enthusiast Meet", "Detailing Workshop", "Track Day Kampala",
];

export function generateEvents(count = 30): Event[] {
  const rand = seededRandom(77);
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const daysOffset = i < 8 ? 7 + i * 12 : -(i - 7) * 15;
    const date = new Date(now);
    date.setDate(date.getDate() + daysOffset);
    const dateStr = date.toISOString().split("T")[0];
    const district = pick(UGANDAN_DISTRICTS, i);
    return {
      id: `event-${i + 1}`,
      title: pick(EVENT_TITLES, i),
      poster: eventPhoto(i),
      date: dateStr,
      time: `${8 + (i % 4) * 2}:00 AM`,
      venue: pick(["Club House", "Speke Resort", "Source of Nile", "Imperial Resort", "Lake Victoria Hotel", "Sheraton Kampala"], i),
      district,
      description: `Join fellow BMW enthusiasts for an unforgettable ${pick(EVENT_TITLES, i).toLowerCase()} in ${district}. Experience the thrill of driving with Uganda's finest BMW community.`,
      registeredCount: Math.floor(rand() * 40) + 10,
      maxCapacity: 50 + Math.floor(rand() * 50),
      gallery: Array.from({ length: 4 }, (_, j) => eventPhoto(i + j)),
      location: {
        lat: 0.3 + rand() * 2.5,
        lng: 32.5 + rand() * 1.5,
      },
      status: daysOffset > 0 ? "upcoming" : "past",
    };
  });
}

export function generateGarages(count = 30): Garage[] {
  const names = [
    "BMW Specialists Kampala", "AutoHaus Uganda", "Precision Motors Entebbe",
    "German Auto Care", "M Performance Centre", "Bavarian Garage Jinja",
    "Elite BMW Service", "Master Mechanics UG", "ProTune Performance",
    "Luxury Auto Works", "Speed Shop Kampala", "Bimmer Brothers",
    "Auto Excellence Mbarara", "Fort Portal Motors", "Northern Auto Care Gulu",
    "Eastern BMW Service Mbale", "Highland Auto Kabale", "West Nile Motors Arua",
    "Masaka Auto Centre", "Wakiso Performance", "Mukono German Auto",
    "Lake Side Motors", "Capital City BMW", "Premium Auto Uganda",
    "Racing Line Garage", "Carbon Fibre Detailing", "Alpina Tuning UG",
    "OEM Parts Uganda", "Classic BMW Restoration", "Mobile Mechanic Pro",
  ];
  const rand = seededRandom(55);
  return Array.from({ length: count }, (_, i) => ({
    id: `garage-${i + 1}`,
    name: pick(names, i),
    logo: avatarUrl(i + 10),
    cover: unsplashBMW(i + 20, 1200),
    services: Array.from({ length: 4 + Math.floor(rand() * 4) }, (_, j) => pick(GARAGE_SERVICES, i + j)),
    phone: `+256 7${Math.floor(rand() * 9)}${Math.floor(rand() * 9000000 + 1000000)}`,
    email: `info@${pick(names, i).toLowerCase().replace(/\s+/g, "")}.ug`,
    hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
    location: `${pick(["Plot", "Block", "Unit"], i)} ${100 + i}, ${pick(UGANDAN_DISTRICTS, i)} Road`,
    district: pick(UGANDAN_DISTRICTS, i),
    rating: 3.5 + rand() * 1.5,
    reviews: Math.floor(rand() * 200) + 10,
    lat: 0.3 + rand() * 2.5,
    lng: 32.5 + rand() * 1.5,
  }));
}

export function generateMarketplace(count = 50, members: Member[]): MarketplaceListing[] {
  const rand = seededRandom(33);
  const titles = [
    "BMW E46 330i", "M3 Competition Wheels", "OEM Brake Pads Set", "BBS CH-R 19inch",
    "M Performance Exhaust", "Alpine White Paint Kit", "N54 Turbo Upgrade",
    "Leather Seat Covers", "BMW Floor Mats", "Carbon Fiber Mirror Caps",
    "Run Flat Tyres 245/40", "M Sport Steering Wheel", "Angel Eyes Headlights",
    "BMW Club Polo Shirt", "Detailing Kit Premium", "E39 M5 Bumper",
    "F30 Front Splitter", "X5 Roof Rails", "BMW Key Fob Cover", "M Badge Set",
  ];
  return Array.from({ length: count }, (_, i) => {
    const seller = pick(members, i);
    const basePrice = (500000 + Math.floor(rand() * 50000000));
    return {
      id: `listing-${i + 1}`,
      title: `${pick(titles, i)} - ${pick(BMW_MODELS, i)}`,
      images: Array.from({ length: 1 + Math.floor(rand() * 3) }, (_, j) => clubPhoto(i + j)),
      seller: seller.name,
      sellerId: seller.id,
      price: basePrice,
      condition: pick(["New", "Like New", "Good", "Fair"] as const, Math.floor(rand() * 4)),
      category: pick(MARKETPLACE_CATEGORIES, i),
      location: pick(UGANDAN_DISTRICTS, i),
      description: `Quality ${pick(MARKETPLACE_CATEGORIES, i).toLowerCase()} for BMW enthusiasts. Well maintained and ready for pickup in ${pick(UGANDAN_DISTRICTS, i)}.`,
    };
  });
}

const ROUTE_PAIRS = [
  ["Kampala", "Entebbe"], ["Kampala", "Jinja"], ["Kampala", "Fort Portal"],
  ["Kampala", "Mbarara"], ["Kampala", "Kabale"], ["Kampala", "Sipi Falls"],
  ["Entebbe", "Jinja"], ["Jinja", "Mbale"], ["Mbarara", "Kabale"],
  ["Fort Portal", "Kasese"], ["Gulu", "Kitgum"], ["Masaka", "Mbarara"],
  ["Kampala", "Gulu"], ["Kampala", "Mbale"], ["Kampala", "Arua"],
  ["Kampala", "Masaka"], ["Entebbe", "Masaka"], ["Jinja", "Soroti"],
  ["Mbarara", "Fort Portal"], ["Kabale", "Kisoro"], ["Kampala", "Mukono"],
  ["Wakiso", "Entebbe"], ["Kampala", "Lira"], ["Jinja", "Tororo"],
  ["Fort Portal", "Hoima"],
];

export function generateRoutes(count = 25): DrivingRoute[] {
  const rand = seededRandom(88);
  return Array.from({ length: count }, (_, i) => {
    const [from, to] = pick(ROUTE_PAIRS, i);
    return {
      id: `route-${i + 1}`,
      name: `${from} → ${to}`,
      from,
      to,
      distance: `${80 + Math.floor(rand() * 400)} km`,
      estimatedTime: `${1 + Math.floor(rand() * 6)}h ${Math.floor(rand() * 59)}m`,
      roadQuality: 3 + Math.floor(rand() * 2),
      scenicRating: 3 + Math.floor(rand() * 2),
      photos: Array.from({ length: 3 }, (_, j) => unsplashBMW(i + j + 50)),
      stops: Array.from({ length: 2 + Math.floor(rand() * 4) }, (_, j) =>
        `${pick(["Rest Stop", "Viewpoint", "Fuel Station", "Restaurant", "Photo Spot"], j)} - ${pick(UGANDAN_DISTRICTS, i + j)}`
      ),
      lat: 0.3 + rand() * 2.5,
      lng: 32.5 + rand() * 1.5,
    };
  });
}

export function generateGallery(count = 60, memberList?: Member[]): GalleryItem[] {
  const categories = ["Events", "Cars", "Road Trips", "Members", "Videos"] as const;
  const aspects = [0.75, 1, 1.2, 1.5, 0.8, 1.33];
  const galleryPool = [
    ...LOCAL_IMAGES.events.map((img) => ({ img, category: "Events" as const })),
    ...LOCAL_IMAGES.cars.map((img) => ({ img, category: "Cars" as const })),
    ...LOCAL_IMAGES.m4.map((img) => ({ img, category: "Cars" as const })),
    ...LOCAL_IMAGES.m8.map((img) => ({ img, category: "Cars" as const })),
    { img: LOCAL_IMAGES.events[2], category: "Members" as const },
    { img: LOCAL_IMAGES.m4[3], category: "Members" as const },
  ];
  return Array.from({ length: count }, (_, i) => {
    const item = galleryPool[i % galleryPool.length];
    return {
      id: `gallery-${i + 1}`,
      image: item.img,
      category: item.category,
      title: memberList
        ? `${item.category} - ${memberList[i % memberList.length].name}`
        : `${item.category} - ${pick(UGANDAN_DISTRICTS, i)}`,
      aspectRatio: pick(aspects, i),
    };
  });
}

export function generateForumPosts(count = 150, members: Member[]): ForumPost[] {
  const rand = seededRandom(66);
  const titles = [
    "Best oil for N54 engine?", "E46 restoration progress", "Kampala to Jinja route tips",
    "Where to buy OEM parts?", "Track day preparation checklist", "M3 vs M4 debate",
    "Insurance recommendations Uganda", "Detailing products that work", "Club meet photos",
    "Suspension upgrade advice", "Winter storage tips", "New member introduction",
    "Charity drive planning", "Photography spots near Entebbe", "Turbo upgrade experiences",
  ];
  return Array.from({ length: count }, (_, i) => {
    const author = pick(members, i);
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(rand() * 365));
    return {
      id: `post-${i + 1}`,
      title: pick(titles, i),
      author: author.name,
      authorId: author.id,
      category: pick(FORUM_CATEGORIES, i),
      content: `Hey fellow BMW enthusiasts! I wanted to share my experience with ${pick(titles, i).toLowerCase()}. Would love to hear your thoughts and recommendations from the Uganda BMW community.`,
      likes: Math.floor(rand() * 100),
      comments: Math.floor(rand() * 50),
      image: rand() > 0.6 ? unsplashBMW(i) : undefined,
      createdAt: date.toISOString(),
    };
  });
}

export const partners: Partner[] = [
  { id: "p1", name: "BMW Kampala", logo: avatarUrl(1), category: "Dealership" },
  { id: "p2", name: "Tyre World Uganda", logo: avatarUrl(2), category: "Tyre Shop" },
  { id: "p3", name: "Jubilee Insurance", logo: avatarUrl(3), category: "Insurance" },
  { id: "p4", name: "AutoGlow Detailing", logo: avatarUrl(4), category: "Detailing" },
  { id: "p5", name: "RevUp Performance", logo: avatarUrl(5), category: "Tuning" },
  { id: "p6", name: "Bavarian Parts UG", logo: avatarUrl(6), category: "Parts" },
  { id: "p7", name: "Shell Uganda", logo: avatarUrl(7), category: "Fuel Partner" },
  { id: "p8", name: "DT Dobie", logo: avatarUrl(8), category: "Dealership" },
  { id: "p9", name: "CMC Motors", logo: avatarUrl(9), category: "Service" },
  { id: "p10", name: "UAP Insurance", logo: avatarUrl(10), category: "Insurance" },
  { id: "p11", name: "Ceramic Pro UG", logo: avatarUrl(11), category: "Detailing" },
  { id: "p12", name: "M Performance Parts", logo: avatarUrl(12), category: "Performance" },
  { id: "p13", name: "Total Energies", logo: avatarUrl(13), category: "Fuel Partner" },
  { id: "p14", name: "AutoXpress", logo: avatarUrl(14), category: "Tyre Shop" },
  { id: "p15", name: "German Auto Imports", logo: avatarUrl(15), category: "Parts" },
  { id: "p16", name: "RMA Motors", logo: avatarUrl(16), category: "Dealership" },
  { id: "p17", name: "Speedhunters UG", logo: avatarUrl(17), category: "Tuning" },
  { id: "p18", name: "Prime Insurance", logo: avatarUrl(18), category: "Insurance" },
  { id: "p19", name: "Luxury Wash Kampala", logo: avatarUrl(19), category: "Detailing" },
  { id: "p20", name: "Bimmer Nation", logo: avatarUrl(20), category: "Merchandise" },
];

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Transporter 1", photo: avatarUrl(29), car: "G30 530i", quote: "BMW Club Uganda is more than a club — it's a brotherhood. Proud to serve as president and build this community together.", rating: 5 },
  { id: "t2", name: "Willer Fx", photo: avatarUrl(4), car: "BMW Enthusiast", quote: "From meetups to road trips, every moment with this club reminds me why we drive BMW. The passion here is unmatched.", rating: 5 },
  { id: "t3", name: "Benedict Magandazi", photo: avatarUrl(28), car: "F30 330i", quote: "Joining BMW Club Uganda connected me with genuine enthusiasts who share the same love for performance and community.", rating: 5 },
  { id: "t4", name: "Swift Shark", photo: avatarUrl(10), car: "E46 M3", quote: "The events, the garages, the friendships — everything about this club feels premium and authentic.", rating: 5 },
  { id: "t5", name: "Enock Onzoma", photo: avatarUrl(14), car: "E39 528i", quote: "Whether you're restoring a classic or daily-driving your BMW, you'll find your people here in Uganda.", rating: 5 },
];

export const shopProducts: ShopProduct[] = [
  {
    id: "s1",
    name: "BMW Motorsport Polo",
    image: LOCAL_IMAGES.products[0],
    category: "Apparel",
    description: "Official white BMW Motorsport polo with club branding — as worn by members.",
  },
  {
    id: "s2",
    name: "M Power Cap & Bag Set",
    image: LOCAL_IMAGES.products[1],
    category: "Accessories",
    description: "Black BMW cap with matching M Power bag — official club merchandise.",
  },
  {
    id: "s3",
    name: "Club Polo Shirt",
    image: LOCAL_IMAGES.products[2],
    category: "Apparel",
    description: "Clean white BMW Club Uganda polo for meets and everyday wear.",
  },
  {
    id: "s4",
    name: "Member Polo Portrait",
    image: LOCAL_IMAGES.products[3],
    category: "Apparel",
    description: "Premium club polo — the signature look of BMW Club Uganda.",
  },
];

export const clubStats: ClubStats = {
  members: REAL_MEMBER_COUNT,
  registeredBMWs: REAL_MEMBER_COUNT,
  eventsHosted: 30,
  partnerGarages: 30,
  roadTripsCompleted: 25,
  citiesRepresented: 14,
};

const _members = buildRealMembers();
export const members = _members;
export const vehicles = generateVehicles(_members.length, _members);
export const events = generateEvents(30);
export const garages = generateGarages(30);
export const marketplaceListings = generateMarketplace(30, _members);
export const drivingRoutes = generateRoutes(25);
export const galleryItems = generateGallery(60, _members);
export const forumPosts = generateForumPosts(40, _members);

export function getMemberById(id: string) {
  return members.find((m) => m.id === id);
}

export function getEventById(id: string) {
  return events.find((e) => e.id === id);
}

export function getListingById(id: string) {
  return marketplaceListings.find((l) => l.id === id);
}

export function getGarageById(id: string) {
  return garages.find((g) => g.id === id);
}
