import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FounderSection from "@/components/FounderSection";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import HomeBreakoutRooms from "@/components/HomeBreakoutRooms";
import HomeRemoteJobs from "@/components/HomeRemoteJobs";
import MentorshipSection from "@/components/MentorshipSection";
import ReviewsSection from "@/components/ReviewsSection";
import AdSense from "@/components/AdSense";
import JobAlertsExitPopup from "@/components/JobAlertsExitPopup";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <FounderSection />
        <ReviewsSection />
        <div className="container mx-auto px-4">
          <AdSense slot="1226790098" />
        </div>
        <HomeRemoteJobs />
        <div id="opportunities">
          <OpportunitiesSection limit={6} />
        </div>
        <HomeBreakoutRooms />
        <MentorshipSection />
      </main>
      <Footer />
      <JobAlertsExitPopup />
    </div>
  );
};

export default Index;
