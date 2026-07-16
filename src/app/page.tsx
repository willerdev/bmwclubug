import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ModelsCarousel } from "@/components/home/ModelsCarousel";
import { EventsPreview } from "@/components/home/EventsPreview";
import { EventsAttendedSection } from "@/components/home/EventsAttendedSection";
import { MemberSpotlight } from "@/components/home/MemberSpotlight";
import { PartnerGaragesPreview } from "@/components/home/PartnerGaragesPreview";
import { MarketplacePreview } from "@/components/home/MarketplacePreview";
import { RoutesPreview } from "@/components/home/RoutesPreview";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { ShopPreview } from "@/components/home/ShopPreview";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { HomeBrandSection } from "@/components/home/HomeBrandSection";
import { RevealOnScroll } from "@/components/effects/RevealOnScroll";
import { fetchMembers, fetchSettings } from "@/lib/public-data";
import { LOCAL_IMAGES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let heroSrc: string = LOCAL_IMAGES.hero;
  let memberCount = 45;

  try {
    const [settings, members] = await Promise.all([fetchSettings(), fetchMembers()]);
    const heroSetting = settings.hero_image as { url?: string } | undefined;
    if (heroSetting?.url) heroSrc = heroSetting.url;
    memberCount = members.length;
  } catch {
    // use defaults
  }

  return (
    <>
      <Hero heroSrc={heroSrc} memberCount={memberCount} />
      <RevealOnScroll>
        <AboutSection />
      </RevealOnScroll>
      <RevealOnScroll delay={0.05}>
        <HomeBrandSection />
      </RevealOnScroll>
      <RevealOnScroll delay={0.08}>
        <StatsSection />
      </RevealOnScroll>
      <RevealOnScroll direction="left">
        <ModelsCarousel />
      </RevealOnScroll>
      <RevealOnScroll>
        <EventsPreview />
      </RevealOnScroll>
      <RevealOnScroll delay={0.05}>
        <EventsAttendedSection />
      </RevealOnScroll>
      <RevealOnScroll delay={0.05}>
        <MemberSpotlight />
      </RevealOnScroll>
      <RevealOnScroll direction="right">
        <PartnerGaragesPreview />
      </RevealOnScroll>
      <RevealOnScroll>
        <ShopPreview />
      </RevealOnScroll>
      <RevealOnScroll delay={0.05}>
        <MarketplacePreview />
      </RevealOnScroll>
      <RevealOnScroll direction="left">
        <RoutesPreview />
      </RevealOnScroll>
      <RevealOnScroll>
        <GalleryPreview />
      </RevealOnScroll>
      <RevealOnScroll delay={0.05}>
        <SponsorsSection />
      </RevealOnScroll>
      <RevealOnScroll>
        <TestimonialsSection />
      </RevealOnScroll>
    </>
  );
}
