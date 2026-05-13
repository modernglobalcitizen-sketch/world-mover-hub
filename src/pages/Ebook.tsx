import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ebookCover from "@/assets/ebook-cover.png";
import workVisasCover from "@/assets/work-visas-ebook-cover.png";
import remoteJobChecklistMockup from "@/assets/remote-job-checklist-mockup.png";
import remoteJobChecklistCover from "@/assets/remote-job-checklist-cover.png";

interface EbookItem {
  title: string;
  cover: string;
  originalCover?: string;
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
    description: "Build a \"Global Resume\". Transform a gap year or a career break into a competitive advantage. Discover how to live in some of the world's most beautiful locations for a fraction of your current expenses by leveraging work-exchange and skill-based volunteering that covers your housing. This guide teaches you how to stay longer and go deeper and build a global network of friends, mentors, and professional contacts.",
    paypalLink: "https://www.paypal.com/ncp/payment/SRE6FSADGNJQQ",
  },
  {
    title: "Top Countries for Work Visas",
    cover: workVisasCover,
    price: "$25",
    description: "This isn't just a directory; it's a filtered search of the world's most accessible opportunities. A deep dive into the 10 most strategically valuable countries for 2026. Clear breakdowns of Skilled Worker Permits and other pathways including how long it takes to get a work visa and how long it is valid for. We tell you exactly which \"door\" is easiest to open.\n\nYou'll also find where to find work (the specific platforms local recruiters actually use) and which In-Demand Careers (Tech, Healthcare, Green Energy) are currently being fast-tracked for approval.\n\nFrom the cost of a quiet one-bedroom in the best neighborhoods, we cover housing and the secret CV structures that pass the local ATS (Applicant Tracking Systems).\n\nWhen you purchase this guide, you aren't buying pages; you're buying time and certainty. No more \"guessing\" if your documents are right. We focus on countries that value skills over birthright. Learn how to position your professional experience as your most powerful \"Travel Document.\"",
    paypalLink: "https://www.paypal.com/ncp/payment/USBYCBHF2X25N",
  },
  {
    title: "Remote Job Beginner Checklist",
    cover: remoteJobChecklistMockup,
    originalCover: remoteJobChecklistCover,
    price: "$29",
    description: "After hosting 3 webinars and speaking with countless newbies, one thing became clear: you want a straightforward process from beginner to remote job. This is exactly what they asked for.\n\nFrom mindset shift, to career roadmap, to resume, portfolio, LinkedIn — it's all included. Straightforward, easy to understand, and it comes with a checklist to keep you accountable every step of the way.",
    paypalLink: "https://www.paypal.com/ncp/payment/MZ9NYBNTZMN2Q",
  },
];

const Ebook = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleBuy = (paypalLink?: string) => {
    if (!paypalLink) return;
    // Redirect in the same tab so PayPal's post-payment return URL
    // (configured to /ebook-thank-you) only fires after successful payment.
    window.location.href = paypalLink;
  };

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("affiliate_ref", ref.toUpperCase());
    }
  }, [searchParams]);

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
              Resources for Professionals from the Global South
            </h1>
            <p className="text-muted-foreground text-lg">
              Practical guides to help you work, travel, and thrive internationally.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {ebooks.filter((b) => b.title === "Remote Job Beginner Checklist").map((book, i) => (
              <div
                key={i}
                className="bg-card text-card-foreground rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-8"
              >
                {book.comingSoon && (
                  <Badge className="absolute top-4 right-4 gap-1" variant="secondary">
                    <Clock className="w-3 h-3" />
                    Coming Soon
                  </Badge>
                )}
                <div className="flex-shrink-0 w-full md:w-1/2 lg:w-5/12 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full rounded-lg shadow-lg object-contain max-h-[400px]"
                    />
                    {book.originalCover && (
                      <img
                        src={book.originalCover}
                        alt={`${book.title} cover`}
                        className="w-full rounded-lg shadow-lg object-contain max-h-[400px]"
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-5 md:space-y-6 w-full md:w-1/2 lg:w-7/12">
                  <h2 className="text-2xl md:text-3xl font-bold font-serif">{book.title}</h2>
                  <p className="text-muted-foreground text-base md:text-lg whitespace-pre-line leading-relaxed">{book.description}</p>
                  <p className="text-3xl font-bold text-primary">{book.price}</p>
                  <div>
                    {book.comingSoon ? (
                      <Button size="lg" className="w-full text-lg" disabled>
                        Coming Soon
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className="w-full text-lg gap-2"
                        onClick={() => handleBuy(book.paypalLink)}
                      >
                        Buy Now
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
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
