import { neon } from "@neondatabase/serverless";

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return neon(url);
}

export type DbEvent = {
  id: string;
  title: string;
  poster_url: string;
  date: string;
  time: string;
  venue: string;
  district: string;
  description: string;
  status: "upcoming" | "past";
  capacity: number;
  registered_count: number;
  created_at: string;
  updated_at: string;
};

export type DbPartner = {
  id: string;
  name: string;
  logo_url: string;
  category: string;
  created_at: string;
  updated_at: string;
};

export type DbGarage = {
  id: string;
  name: string;
  logo_url: string;
  cover_url: string;
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
  created_at: string;
  updated_at: string;
};

export type DbProduct = {
  id: string;
  name: string;
  image_url: string;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type DbApplication = {
  id: string;
  payload: Record<string, unknown>;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

export type DbMember = {
  id: string;
  name: string;
  email: string;
  photo_url: string;
  bio: string;
  district: string;
  membership_level: string;
  years_in_club: number;
  rank: string;
  badges: string[];
  favorite_route: string;
  cars: string[];
  joined_at: string;
  social_instagram: string;
  social_twitter: string;
  social_facebook: string;
  awards: string[];
  gallery_urls: string[];
  created_at: string;
  updated_at: string;
};

export type DbGalleryItem = {
  id: string;
  image_url: string;
  category: string;
  title: string;
  aspect_ratio: number;
  created_at: string;
};

export type DbMedia = {
  id: string;
  filename: string;
  mime: string;
  created_at: string;
};
