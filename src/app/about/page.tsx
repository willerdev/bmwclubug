import { PageHeader } from "@/components/ui/PageHeader";
import { AboutSection } from "@/components/home/AboutSection";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about BMW Club Uganda — our mission, community, and passion for driving.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Us"
        subtitle="Discover the story behind Uganda's premier BMW enthusiast community"
      />
      <AboutSection />
      <StatsSection />
      <TestimonialsSection />
    </>
  );
}
