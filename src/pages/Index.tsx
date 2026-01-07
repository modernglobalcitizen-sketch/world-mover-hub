import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import OpportunitiesSection from "@/components/OpportunitiesSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <div id="opportunities">
          <OpportunitiesSection limit={6} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
