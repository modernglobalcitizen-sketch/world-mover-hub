import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OpportunitiesSection from "@/components/OpportunitiesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div id="opportunities">
          <OpportunitiesSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
