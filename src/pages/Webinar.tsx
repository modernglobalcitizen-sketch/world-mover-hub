import { CheckCircle, Globe, DollarSign, Sparkles, Laptop, TrendingUp, MessageSquare, CalendarDays, Rocket, FileText, Briefcase, Search, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import webinarFlyer from "@/assets/webinar-flyer.png";

import { getLocalWebinarTime, getWebinarTimeInZones } from "@/lib/webinar";

const webinars = [
  {
    id: "remote-webinar",
    title: "Remote Work Webinar",
    date: getLocalWebinarTime(),
    tagline: "Land your first remote job",
    description:
      "A hands-on webinar designed for the global diaspora. Master the skills, tools, and strategies to land remote roles and build a career without borders.",
    highlights: [
      { icon: Rocket, text: "Live, structured training" },
      { icon: Laptop, text: "Hands-on practice with real remote work tools" },
      { icon: TrendingUp, text: "Step-by-step plan to land your first remote role" },
      { icon: MessageSquare, text: "Build an online presence that attracts recruiters" },
      { icon: DollarSign, text: "Negotiate pay and price your skills globally" },
      { icon: Globe, text: "Join a community of peers building global careers" },
      { icon: Briefcase, text: "Create a free portfolio that showcases your work" },
      { icon: FileText, text: "Optimize your resume for global remote roles" },
      { icon: Search, text: "Learn exactly where to find LEGIT remote work" },
      { icon: LifeBuoy, text: "Personalized support throughout the webinar" },
    ],
  },
];

const Webinar = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <span className="inline-block mb-4 rounded-full bg-primary-foreground/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              <Sparkles className="inline h-4 w-4 mr-1 -mt-0.5" />
              New Webinar
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              Remote Work Webinar
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-6">
              A hands-on webinar to help you land your first remote job. Save your spot below.
            </p>
          </div>
        </section>

        {/* Flyer */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <img
              src={webinarFlyer}
              alt="Finally Land Remote Work webinar with host Kenisha Archer — May 2, 2026 at 3PM EAT"
              className="w-full h-auto rounded-2xl shadow-soft border border-border"
              loading="lazy"
            />
          </div>
        </section>

        {webinars.map((webinar) => (
          <section key={webinar.id} className="py-16 md:py-20 odd:bg-background even:bg-muted/30">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                  {webinar.title}
                </h2>
                {webinar.date ? (
                  <>
                    <p className="flex items-center justify-center gap-2 text-base font-semibold text-primary mb-2">
                      <CalendarDays className="h-4 w-4" />
                      {webinar.date}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-3">
                      {getWebinarTimeInZones().map(({ label, time }) => (
                        <span key={label} className="text-xs text-muted-foreground font-medium">
                          {time} <span className="text-muted-foreground/70">{label}</span>
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm font-medium text-muted-foreground mb-3">Date coming soon</p>
                )}
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {webinar.description}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {webinar.highlights.map((item, i) => (
                  <Card key={i} className="border-border/60">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-foreground font-medium">{item.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Reserve Spot CTA */}
        <section className="py-16 md:py-20 bg-card">
          <div className="container mx-auto px-4 max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Reserve Your Spot
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Secure your seat for the May 2, 2026 webinar. Complete your payment to confirm registration.
            </p>

            <Button
              asChild
              size="lg"
              className="w-full font-semibold text-lg py-6 h-auto"
            >
              <a
                href="https://www.paypal.com/ncp/payment/WWH3PYEPG55R2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pay & Reserve Your Spot
              </a>
            </Button>

            <p className="mt-4 text-sm text-muted-foreground">
              You'll receive your access details by email after payment.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Webinar;
