import type { Member, MembershipLevel } from "@/types";
import { UGANDAN_DISTRICTS } from "@/lib/constants";

const BADGES = [
  "Road Warrior", "Community Leader", "M Enthusiast", "Event Regular",
  "Charity Champion", "Long Distance Driver",
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function avatarUrl(seed: number): string {
  return `https://i.pravatar.cc/300?img=${(seed % 70) + 1}`;
}

interface RealMemberInput {
  name: string;
  level?: MembershipLevel;
  rank?: string;
  district?: string;
  cars?: string[];
  bio?: string;
}

const REAL_MEMBER_DATA: RealMemberInput[] = [
  { name: "Reda", level: "Enthusiast" },
  { name: "Sheilock", level: "Enthusiast" },
  { name: "EKO S Auto Centre Ltd", level: "Premium Member", rank: "Partner Garage", cars: ["F30 320i"], bio: "Trusted BMW service partner supporting club members across Kampala." },
  { name: "Eng Pharooq", level: "Enthusiast" },
  { name: "Willer Fx", level: "Club Ambassador", rank: "Active Member", bio: "Passionate BMW enthusiast and active contributor to BMW Club Uganda." },
  { name: "Pluga Guy", level: "Explorer" },
  { name: "Mutyaba Elijah", level: "Enthusiast" },
  { name: "Felix", level: "Enthusiast" },
  { name: "Fort 2.0", level: "Enthusiast", cars: ["E46 330i"] },
  { name: "Chris", level: "Enthusiast" },
  { name: "Swift Shark", level: "Premium Member" },
  { name: "Member 705", level: "Explorer" },
  { name: "Member 704", level: "Enthusiast" },
  { name: "BMW Lights", level: "Premium Member", rank: "Partner Business", bio: "Specialist in BMW lighting upgrades and accessories." },
  { name: "Enock Onzoma", level: "Enthusiast" },
  { name: "Phoenix", level: "Enthusiast" },
  { name: "Member 785", level: "Explorer" },
  { name: "Member 775", level: "Explorer" },
  { name: "MDM", level: "Enthusiast" },
  { name: "Powell", level: "Enthusiast" },
  { name: "Denno", level: "Enthusiast" },
  { name: "Salman Motors", level: "Premium Member", rank: "Partner Business", cars: ["X5 xDrive40i"] },
  { name: "Member 703", level: "Explorer" },
  { name: "Emmanuel", level: "Enthusiast" },
  { name: "Drake Troubleman", level: "Enthusiast" },
  { name: "Uncle Joe", level: "Enthusiast" },
  { name: "H", level: "Explorer" },
  { name: "Rockie", level: "Enthusiast" },
  { name: "Benedict Magandazi", level: "Enthusiast" },
  {
    name: "Transporter 1",
    level: "Founder",
    rank: "President",
    bio: "Founding president of BMW Club Uganda, leading the community with passion and dedication.",
    cars: ["G30 530i"],
  },
];

export function buildRealMembers(): Member[] {
  return REAL_MEMBER_DATA.map((input, i) => {
    const id = `member-${i + 1}`;
    const slug = slugify(input.name);
    const district = input.district ?? UGANDAN_DISTRICTS[i % UGANDAN_DISTRICTS.length];
    const cars = input.cars ?? [`${["E46", "F30", "E39", "G20"][i % 4]} ${["320i", "330i", "520i", "118i"][i % 4]}`];

    return {
      id,
      name: input.name,
      email: slug ? `${slug}@bmwclub.ug` : `member${i + 1}@bmwclub.ug`,
      photo: avatarUrl(i + 3),
      bio:
        input.bio ??
        `Proud BMW Club Uganda member from ${district}. Passionate about driving, community meetups, and the BMW lifestyle.`,
      district,
      membershipLevel: input.level ?? "Enthusiast",
      joinedAt: new Date(Date.now() - Math.max(1, 3 - (i % 3)) * 365.25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      yearsInClub: Math.max(1, 3 - (i % 3)),
      rank: input.rank ?? "Active Member",
      badges: [BADGES[i % BADGES.length], BADGES[(i + 2) % BADGES.length]],
      favoriteRoute: `${district} → ${UGANDAN_DISTRICTS[(i + 2) % UGANDAN_DISTRICTS.length]}`,
      cars,
      garage: input.name.includes("Auto") || input.name.includes("Motors") ? input.name : undefined,
      social: { instagram: `@${slug.replace(/-/g, "")}_bmw` },
      friends: REAL_MEMBER_DATA.slice(i + 1, i + 4).map((_, j) => `member-${((i + j + 1) % REAL_MEMBER_DATA.length) + 1}`),
      awards: input.rank === "President" ? ["Founding President", "Community Leader"] : [],
      eventHistory: [`event-1`, `event-${(i % 5) + 2}`],
      gallery: [
        `/images/m4_2.jpeg`,
        `/images/event_1.jpeg`,
      ],
    };
  });
}

export const REAL_MEMBER_COUNT = REAL_MEMBER_DATA.length;
