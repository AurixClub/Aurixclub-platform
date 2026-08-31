import { Navbar } from "@/components/navigation/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { OngoingEventsMarquee } from "@/components/home/OngoingEventsMarquee";
import { DepartmentsSection } from "@/components/home/DepartmentsSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollReveal";
import AnnouncementPopup from "@/components/ui/AnnouncementPopup";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-blue-500/30 selection:text-white">
      {/* Scroll Reading Progress Bar */}
      <ScrollProgress />

      {/* Persistent Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow">
        <HeroSection />
        <OngoingEventsMarquee />
        <DepartmentsSection />
        <SponsorsSection />
      </main>

      {/* Footer */}
      <Footer />
      
      {/* Global Announcements */}
      <AnnouncementPopup />
    </div>
  );
}
