import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WebinarBanner from "@/components/WebinarBanner";
import Hero from "@/components/Hero";
import FounderSection from "@/components/FounderSection";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import HomeBreakoutRooms from "@/components/HomeBreakoutRooms";
import HomeRemoteJobs from "@/components/HomeRemoteJobs";
import EbookSection from "@/components/EbookSection";
import ReviewsSection from "@/components/ReviewsSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <WebinarBanner />
        <FounderSection />
        <Hero />
        <EbookSection />
        <HomeRemoteJobs />
        <div id="opportunities">
          <OpportunitiesSection limit={6} />
        </div>
        <HomeBreakoutRooms />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
