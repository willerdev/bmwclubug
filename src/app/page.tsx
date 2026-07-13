import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ModelsCarousel } from "@/components/home/ModelsCarousel";
import { EventsPreview } from "@/components/home/EventsPreview";
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

export default function HomePage() {
  return (
    <>
      <Hero />
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
