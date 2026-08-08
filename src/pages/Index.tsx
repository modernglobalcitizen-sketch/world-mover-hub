import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FounderSection from "@/components/FounderSection";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import HomeRemoteJobs from "@/components/HomeRemoteJobs";
import ReviewsSection from "@/components/ReviewsSection";
import BannerAd from "@/components/BannerAd";
import LovableBannerAd from "@/components/LovableBannerAd";

import SmartLink from "@/components/SmartLink";
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
        <BannerAd />
        <LovableBannerAd />
        <FounderSection />
        <ReviewsSection />
        <HomeRemoteJobs />
        <div id="opportunities">
          <OpportunitiesSection limit={6} />
        </div>
      </main>

      <Footer />
      <JobAlertsExitPopup />
      <SmartLink url="https://www.effectivecpmnetwork.com/bgdrtiw6?key=95fb56ff12f30e3cf93f0fcaf4940efe" />
    </div>
  );
};

export default Index;
