import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ebookCover from "@/assets/ebook-cover.png";
import workVisasCover from "@/assets/work-visas-ebook-cover.png";
import remoteJobChecklistCover from "@/assets/remote-job-checklist-cover.png";

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
    cover: remoteJobChecklistCover,
    price: "$29",
    description: "After hosting 3 webinars and speaking with countless newbies, one thing became clear: you want a straightforward process from beginner to remote job. This is exactly what they asked for.\n\nFrom mindset shift, to career roadmap, to resume, portfolio, LinkedIn — it's all included. Straightforward, easy to understand, and it comes with a checklist to keep you accountable every step of the way.",
    paypalLink: "https://www.paypal.com/ncp/payment/MZ9NYBNTZMN2Q",
  },
];

const Ebook = () => {
  const [searchParams] = useSearchParams();

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
              Resources for the Diaspora
            </h1>
            <p className="text-muted-foreground text-lg">
              Practical guides to help you work, travel, and thrive internationally.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto justify-center">
            {ebooks.filter((b) => b.title === "Remote Job Beginner Checklist").map((book, i) => (
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
                <p className="text-muted-foreground text-sm whitespace-pre-line text-left">{book.description}</p>
                <p className="text-2xl font-bold text-primary">{book.price}</p>
                <div className="space-y-3">
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
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full text-base gap-2"
                  >
                    <Link to="/ebook-download">
                      <Download className="w-5 h-5" />
                      Download Your Ebook
                    </Link>
                  </Button>
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
