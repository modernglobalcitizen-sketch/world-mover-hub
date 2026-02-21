import { BookOpen, Plane, Briefcase, GraduationCap, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ebookCover from "@/assets/ebook-cover.png";

const benefits = [
  { icon: Plane, text: "A first-time international traveler" },
  { icon: Briefcase, text: "Seeking income + international exposure" },
  { icon: Globe, text: "Building travel or visa history" },
  { icon: GraduationCap, text: "Planning long-term, not rushing to immigrate" },
];

const EbookSection = () => {
  return (
    <section className="py-20 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Info */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground rounded-full px-4 py-1.5 text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              New Ebook
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif leading-tight">
              Your International Guide to Work, Travel and Volunteer
            </h2>
            <p className="text-muted text-lg">
              Seasonal work is ideal if you are:
            </p>
            <ul className="space-y-4">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-secondary-foreground/90">{b.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: CTA Card */}
          <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg space-y-6 text-center">
            <img
              src={ebookCover}
              alt="Your International Guide to Work, Volunteer, and Travel by Kenisha Archer"
              className="w-full rounded-lg shadow-md"
            />
            <p className="text-3xl font-bold text-primary">$25</p>
            <p className="text-muted-foreground text-sm">
              Instant access after payment via PayPal
            </p>
            <Button
              size="lg"
              className="w-full text-lg gap-2"
              onClick={() => window.open("https://www.paypal.com/ncp/payment/SRE6FSADGNJQQ", "_blank")}
            >
              Buy Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EbookSection;
