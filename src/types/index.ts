export type MembershipLevel =
  | "Explorer"
  | "Enthusiast"
  | "Premium Member"
  | "Club Ambassador"
  | "Executive Committee"
  | "Founder";

export interface Member {
  id: string;
  name: string;
  email: string;
  photo: string;
  bio: string;
  district: string;
  membershipLevel: MembershipLevel;
  /** YYYY-MM-DD when the member registered / joined */
  joinedAt: string;
  /** Computed from joinedAt */
  yearsInClub: number;
  rank: string;
  badges: string[];
  favoriteRoute: string;
  cars: string[];
  garage?: string;
  social: { instagram?: string; twitter?: string; facebook?: string };
  friends: string[];
  awards: string[];
  eventHistory: string[];
  gallery: string[];
}

export interface BMWModel {
  id: string;
  name: string;
  generation: string;
  year: string;
  engine: string;
  horsepower: number;
  image: string;
  owner: string;
}

export interface EventPost {
  id: string;
  title: string;
  content: string;
  images: string[];
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  poster: string;
  date: string;
  time: string;
  venue: string;
  district: string;
  description: string;
  registeredCount: number;
  maxCapacity: number;
  gallery: string[];
  posts?: EventPost[];
  location: { lat: number; lng: number };
  status: "upcoming" | "past";
}

export interface Garage {
  id: string;
  name: string;
  logo: string;
  cover: string;
  services: string[];
  phone: string;
  email: string;
  hours: string;
  location: string;
  district: string;
  rating: number;
  reviews: number;
  lat: number;
  lng: number;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  images: string[];
  seller: string;
  sellerId: string;
  price: number;
  condition: "New" | "Like New" | "Good" | "Fair";
  category: string;
  location: string;
  description: string;
}

export interface DrivingRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: string;
  estimatedTime: string;
  roadQuality: number;
  scenicRating: number;
  photos: string[];
  stops: string[];
  lat: number;
  lng: number;
}

export interface GalleryItem {
  id: string;
  image: string;
  category: "Events" | "Cars" | "Road Trips" | "Members" | "Videos";
  title: string;
  aspectRatio: number;
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorId: string;
  category: string;
  content: string;
  likes: number;
  comments: number;
  image?: string;
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  car: string;
  quote: string;
  rating: number;
}

export interface ShopProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  price: number;
}

export interface AttendedEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  district: string;
  poster: string;
  description: string;
  sortOrder: number;
}

export interface Vehicle {
  id: string;
  model: string;
  generation: string;
  year: number;
  ownerId: string;
  ownerName: string;
  image: string;
  engine: string;
  color: string;
}

export interface ClubStats {
  members: number;
  registeredBMWs: number;
  eventsHosted: number;
  partnerGarages: number;
  roadTripsCompleted: number;
  citiesRepresented: number;
}
