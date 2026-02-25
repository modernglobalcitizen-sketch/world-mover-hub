import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import HomeBreakoutRooms from "@/components/HomeBreakoutRooms";
import EbookSection from "@/components/EbookSection";
import NewsletterPopup from "@/components/NewsletterPopup";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsletterPopup />
      <Header />
      <main className="flex-1">
        <Hero />
        <EbookSection />
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
