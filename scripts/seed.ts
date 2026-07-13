import { getSql } from "@/lib/db";
import { LOCAL_IMAGES } from "@/lib/constants";
import { buildRealMembers } from "@/data/mock/realMembers";
import { events, partners, garages, shopProducts, galleryItems } from "@/data/mock";

async function seed() {
  const sql = getSql();

  const [{ count: eventCount }] = await sql`SELECT COUNT(*)::int AS count FROM events`;
  if (eventCount === 0) {
    for (const event of events.slice(0, 12)) {
      await sql`
        INSERT INTO events (title, poster_url, date, time, venue, district, description, status, capacity, registered_count)
        VALUES (
          ${event.title},
          ${event.poster},
          ${event.date},
          ${event.time},
          ${event.venue},
          ${event.district},
          ${event.description},
          ${event.status},
          ${event.maxCapacity},
          ${event.registeredCount}
        )
      `;
    }
    console.log("Seeded events");
  }

  const [{ count: partnerCount }] = await sql`SELECT COUNT(*)::int AS count FROM partners`;
  if (partnerCount === 0) {
    for (const partner of partners) {
      await sql`
        INSERT INTO partners (name, logo_url, category)
        VALUES (${partner.name}, ${partner.logo}, ${partner.category})
      `;
    }
    console.log("Seeded partners");
  }

  const [{ count: garageCount }] = await sql`SELECT COUNT(*)::int AS count FROM garages`;
  if (garageCount === 0) {
    for (const garage of garages.slice(0, 12)) {
      await sql`
        INSERT INTO garages (
          name, logo_url, cover_url, services, phone, email, hours,
          location, district, rating, reviews, lat, lng
        )
        VALUES (
          ${garage.name},
          ${garage.logo},
          ${garage.cover},
          ${garage.services},
          ${garage.phone},
          ${garage.email},
          ${garage.hours},
          ${garage.location},
          ${garage.district},
          ${garage.rating},
          ${garage.reviews},
          ${garage.lat},
          ${garage.lng}
        )
      `;
    }
    console.log("Seeded garages");
  }

  const [{ count: productCount }] = await sql`SELECT COUNT(*)::int AS count FROM products`;
  if (productCount === 0) {
    for (const product of shopProducts) {
      await sql`
        INSERT INTO products (name, image_url, category, description)
        VALUES (${product.name}, ${product.image}, ${product.category}, ${product.description})
      `;
    }
    console.log("Seeded products");
  }

  const [{ count: memberCount }] = await sql`SELECT COUNT(*)::int AS count FROM members`;
  if (memberCount === 0) {
    for (const member of buildRealMembers()) {
      await sql`
        INSERT INTO members (
          name, email, photo_url, bio, district, membership_level,
          years_in_club, rank, badges, favorite_route, cars
        )
        VALUES (
          ${member.name},
          ${member.email},
          ${member.photo},
          ${member.bio},
          ${member.district},
          ${member.membershipLevel},
          ${member.yearsInClub},
          ${member.rank},
          ${member.badges},
          ${member.favoriteRoute},
          ${member.cars}
        )
      `;
    }
    console.log("Seeded members");
  }

  const [{ count: galleryCount }] = await sql`SELECT COUNT(*)::int AS count FROM gallery_items`;
  if (galleryCount === 0) {
    for (const item of galleryItems.slice(0, 40)) {
      await sql`
        INSERT INTO gallery_items (image_url, category, title, aspect_ratio)
        VALUES (${item.image}, ${item.category}, ${item.title}, ${item.aspectRatio})
      `;
    }
    console.log("Seeded gallery");
  }

  const settings = await sql`SELECT key FROM site_settings WHERE key = 'hero_image'`;
  if (settings.length === 0) {
    await sql`
      INSERT INTO site_settings (key, value)
      VALUES ('hero_image', ${JSON.stringify({ url: LOCAL_IMAGES.hero })}::jsonb)
    `;
    await sql`
      INSERT INTO site_settings (key, value)
      VALUES (
        'contact',
        ${JSON.stringify({
          phone: "+256 704 056546",
          email: "info@bmwclub.ug",
          location: "Kampala, Uganda",
        })}::jsonb
      )
    `;
    console.log("Seeded settings");
  }

  console.log("Seed complete");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
