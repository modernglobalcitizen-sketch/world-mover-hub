import Header from "@/components/Header";
import OpportunitiesSection from "@/components/OpportunitiesSection";

const Opportunities = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <OpportunitiesSection showViewAll={false} />
      </main>
    </div>
  );
};

export default Opportunities;
