import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import SEO from "@/components/SEO";

const Opportunities = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <SEO
        title="Global Opportunities — Study, Work & Travel Abroad"
        description="Curated study abroad, fully-funded programs, internships, and work-travel opportunities for the Global South."
        path="/opportunities"
      />
      <main className="flex-1">
        <OpportunitiesSection showViewAll={false} />
      </main>
      <Footer />
    </div>
  );
};

export default Opportunities;
