import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ebookCover from "@/assets/ebook-cover.png";
import workVisasCover from "@/assets/work-visas-ebook-cover.png";

interface EbookItem {
  title: string;
  cover: string;
  price: string;
  description: string;
  paypalLink?: string;
  comingSoon?: boolean;
}

const ebooks: EbookItem[] = [
  {
    title: "Your International Guide to Work, Volunteer, and Travel",
    cover: ebookCover,
    price: "$25",
    description: "Everything you need to know about seasonal work, volunteering abroad, and building your travel history.",
    paypalLink: "https://www.paypal.com/ncp/payment/SRE6FSADGNJQQ",
  },
  {
    title: "Top Countries for Work Visas",
    cover: workVisasCover,
    price: "$25",
    description: "Discover the countries that actually want you — with the highest work visa approval rates and how to apply.",
    paypalLink: "https://www.paypal.com/ncp/payment/USBYCBHF2X25N",
  },
];

const Ebook = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground rounded-full px-4 py-1.5 text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              Ebooks
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif">
              Resources for the Diaspora
            </h1>
            <p className="text-muted-foreground text-lg">
              Practical guides to help you work, travel, and thrive internationally.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {ebooks.map((book, i) => (
              <div
                key={i}
                className="bg-card text-card-foreground rounded-2xl p-6 shadow-lg space-y-5 text-center relative overflow-hidden"
              >
                {book.comingSoon && (
                  <Badge className="absolute top-4 right-4 gap-1" variant="secondary">
                    <Clock className="w-3 h-3" />
                    Coming Soon
                  </Badge>
                )}
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full rounded-lg shadow-md"
                />
                <h2 className="text-xl font-bold font-serif">{book.title}</h2>
                <p className="text-muted-foreground text-sm">{book.description}</p>
                <p className="text-2xl font-bold text-primary">{book.price}</p>
                {book.comingSoon ? (
                  <Button size="lg" className="w-full text-lg" disabled>
                    Coming Soon
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full text-lg gap-2"
                    onClick={() => window.open(book.paypalLink, "_blank")}
                  >
                    Buy Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Ebook;
