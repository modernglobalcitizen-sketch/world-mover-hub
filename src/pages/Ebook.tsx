import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EbookSection from "@/components/EbookSection";

const Ebook = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <EbookSection />
      </main>
      <Footer />
    </div>
  );
};

export default Ebook;
