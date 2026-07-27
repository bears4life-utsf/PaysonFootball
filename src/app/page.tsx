import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ScheduleSection } from "@/components/schedule-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F4]">
      <Header />
      <main className="flex-1">
        <Hero />
        <ScheduleSection />
      </main>
      <SiteFooter />
    </div>
  );
}
