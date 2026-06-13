import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FounderSection from "@/components/FounderSection";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import HomeRemoteJobs from "@/components/HomeRemoteJobs";
import MentorshipSection from "@/components/MentorshipSection";
import ReviewsSection from "@/components/ReviewsSection";
import AdSense from "@/components/AdSense";
import Adsterra from "@/components/Adsterra";
import JobAlertsExitPopup from "@/components/JobAlertsExitPopup";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <SEO
        title="Global Moves Network — Global Opportunities for the Global South"
        description="Remote jobs, study abroad programs, work-travel pathways, and visa-friendly opportunities for young professionals from the Global South."
        path="/"
      />
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
        <MentorshipSection />
      </main>
      <Footer />
      <JobAlertsExitPopup />
    </div>
  );
};

export default Index;
