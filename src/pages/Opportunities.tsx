import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OpportunitiesSection from "@/components/OpportunitiesSection";

const Opportunities = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <OpportunitiesSection showViewAll={false} />
      </main>
      <Footer />
    </div>
  );
};

export default Opportunities;
