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

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <HomeBrandSection />
      <StatsSection />
      <ModelsCarousel />
      <EventsPreview />
      <MemberSpotlight />
      <PartnerGaragesPreview />
      <ShopPreview />
      <MarketplacePreview />
      <RoutesPreview />
      <GalleryPreview />
      <SponsorsSection />
      <TestimonialsSection />
    </>
  );
}
