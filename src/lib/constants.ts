export const COLORS = {
  bmwBlue: "#1C69D4",
  bmwBlueLight: "#4D9FFF",
  bmwDarkBlue: "#002C5F",
  bmwNavy: "#0B1F3A",
  bmwRed: "#EB0129",
  bmwRedDark: "#C4001D",
  white: "#FFFFFF",
  glass: "rgba(255, 255, 255, 0.08)",
  background: "#0E1E36",
} as const;

export const CLUB_CONTACT = {
  phone: "+256 704 056546",
  email: "info@bmwclub.ug",
  location: "Kampala, Uganda",
} as const;

/** Club photos from /show, served from /public/images */
export const LOCAL_IMAGES = {
  logo: "/images/club-logo.jpeg",
  icon: "/icon.jpeg",
  hero: "/images/hero_image.jpeg",
  sketches: "/images/bmw-m-sketches.jpeg",
  events: [
    "/images/event_1.jpeg",
    "/images/event_2.jpeg",
    "/images/event_9.jpeg",
    "/images/bmw_cars_1.jpeg",
    "/images/bmw_cars_3.jpeg",
  ] as const,
  products: [
    "/images/product_1.jpeg",
    "/images/product_2.jpeg",
    "/images/product_3.jpeg",
    "/images/product_4.jpeg",
  ] as const,
  cars: [
    "/images/bmw_cars_1.jpeg",
    "/images/bmw_cars_3.jpeg",
    "/images/bmw_cars_4.jpeg",
    "/images/bmw_cars_5.jpeg",
    "/images/bmw_cars_6.jpeg",
    "/images/bmw_cars_8.jpeg",
  ] as const,
  m4: [
    "/images/m4.jpeg",
    "/images/m4_1.jpeg",
    "/images/m4_2.jpeg",
    "/images/m4_3.jpeg",
    "/images/m4_4.jpeg",
    "/images/m4_5.jpeg",
  ] as const,
  m8: [
    "/images/m8_1.jpeg",
    "/images/m8_2.jpeg",
    "/images/m8_3.jpeg",
  ] as const,
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/members", label: "Members" },
  { href: "/events", label: "Events" },
  { href: "/garages", label: "Garages" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/routes", label: "Routes" },
  { href: "/gallery", label: "Gallery" },
  { href: "/forum", label: "Forum" },
  { href: "/blog", label: "Blog" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
] as const;

export const MEMBERSHIP_LEVELS = [
  "Explorer",
  "Enthusiast",
  "Premium Member",
  "Club Ambassador",
  "Executive Committee",
  "Founder",
] as const;

export const UGANDAN_DISTRICTS = [
  "Kampala",
  "Entebbe",
  "Jinja",
  "Mbarara",
  "Fort Portal",
  "Gulu",
  "Mbale",
  "Kabale",
  "Arua",
  "Masaka",
  "Soroti",
  "Lira",
  "Mukono",
  "Wakiso",
] as const;

const CLUB_PHOTOS = [
  ...LOCAL_IMAGES.m4,
  ...LOCAL_IMAGES.m8,
  ...LOCAL_IMAGES.cars,
  ...LOCAL_IMAGES.events,
] as const;

export const BMW_IMAGES = {
  hero: LOCAL_IMAGES.hero,
  e30: LOCAL_IMAGES.cars[0],
  e36: LOCAL_IMAGES.cars[1],
  e46: LOCAL_IMAGES.cars[2],
  e39: LOCAL_IMAGES.cars[3],
  e60: LOCAL_IMAGES.cars[4],
  f30: LOCAL_IMAGES.cars[5],
  g20: LOCAL_IMAGES.m4[0],
  m2: LOCAL_IMAGES.m4[1],
  m3: LOCAL_IMAGES.m4[2],
  m4: LOCAL_IMAGES.m4[3],
  m5: LOCAL_IMAGES.m8[0],
  x3: LOCAL_IMAGES.m8[1],
  x5: LOCAL_IMAGES.cars[5],
  x6: LOCAL_IMAGES.m8[2],
  xm: LOCAL_IMAGES.m4[4],
  community: LOCAL_IMAGES.events[0],
  event: LOCAL_IMAGES.events[1],
  garage: LOCAL_IMAGES.m4[4],
  road: LOCAL_IMAGES.cars[0],
  gallery: CLUB_PHOTOS,
} as const;

export const HERO_VIDEO =
  "https://videos.pexels.com/video-files/4484076/4484076-uhd_2560_1440_25fps.mp4";
