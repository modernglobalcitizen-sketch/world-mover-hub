import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import { Clock, Play, ArrowRight } from "lucide-react";

const WebinarBanner = () => {
  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-foreground/5 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-primary-foreground/5 blur-2xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <span className="inline-block mb-5 rounded-full bg-primary-foreground/20 px-5 py-1.5 text-sm font-semibold tracking-wide uppercase text-primary-foreground backdrop-blur-sm">
          Live Webinar · Limited Seats
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
          Your First $1,000 Online Plan
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-8">
          A step-by-step blueprint for building your first online income stream — designed for the global diaspora.
        </p>

        <div className="inline-flex items-center gap-3 rounded-xl bg-primary-foreground/15 backdrop-blur-sm px-6 py-3 text-primary-foreground font-medium text-lg mb-10">
          <Clock className="h-5 w-5" />
          <span>March 12, 2026 · 3:00 PM UTC</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="group text-lg py-6 h-auto" asChild>
            <Link to="/webinar">
              <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
              Register Now — $30
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <p className="mt-5 text-sm text-primary-foreground/60">
          1-hour live session with Q&A · Secure payment via PayPal
        </p>
      </div>
    </section>
  );
};

export default WebinarBanner;
