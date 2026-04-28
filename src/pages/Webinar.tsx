import { CheckCircle, Globe, DollarSign, Sparkles, Laptop, TrendingUp, MessageSquare, CalendarDays, Rocket, FileText, Briefcase, Search, LifeBuoy, Building2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import webinarFlyer from "@/assets/webinar-flyer.png";
import beforeLocalEconomy from "@/assets/before-local-economy.jpg";
import afterGlobalCareer from "@/assets/after-global-career.jpg";

import { getLocalWebinarTime, getWebinarTimeInZones } from "@/lib/webinar";

const webinars = [
  {
    id: "remote-webinar",
    title: "Secure Your First Remote Role",
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
      { icon: DollarSign, text: "How to accept payment from international clients" },
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
              Secure Your First Remote Role
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-6">
              A hands-on webinar to help you land your first remote job. Just <strong className="text-primary-foreground">$15 USD</strong> — save your spot below.
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

        {/* Before / After */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                From Stuck to Economic Freedom
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                What changes when you stop trading time for a weak local paycheck — and start earning in a stronger global currency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-border shadow-soft">
                  <img
                    src={beforeLocalEconomy}
                    alt="Stressed Black woman stuck in a low-paying local job, holding a small paycheck surrounded by weak local currency"
                    className="w-full h-72 md:h-80 object-cover grayscale-[20%]"
                    loading="lazy"
                    width={1280}
                    height={832}
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Before
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    Working hard, paid too little
                  </h3>
                  <p className="text-muted-foreground">
                    Long hours. A small paycheck. Money that doesn't go far. Your skills are worth more than your local job will ever pay.
                  </p>
                </div>
              </div>

              {/* After */}
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 shadow-soft">
                  <img
                    src={afterGlobalCareer}
                    alt="Confident remote worker on a video call from a sunlit workspace, earning in a stronger global currency"
                    className="w-full h-72 md:h-80 object-cover"
                    loading="lazy"
                    width={1280}
                    height={832}
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                    After
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    Earning in a stronger currency
                  </h3>
                  <p className="text-muted-foreground">
                    Remote clients, global rates, and the freedom to work from anywhere. The same skills — paid in a currency that stretches further at home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career Services */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 border-t border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                Career Services
              </Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                Go Beyond the Webinar — Land Your Remote Role Faster
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Want hands-on help after the webinar? Get a polished resume, interview prep, and direct introductions to hiring agencies.
              </p>
              <div className="mt-6 inline-flex items-baseline gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground shadow-soft">
                <span className="text-3xl font-display font-bold">$30</span>
                <span className="text-sm opacity-90">/ all three services</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="border-primary/20 hover:border-primary/40 hover:shadow-hover transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Resume Review & Rewrite</CardTitle>
                  <CardDescription>
                    Get a recruiter-ready resume tailored for remote roles. We highlight your transferable skills and optimize for ATS systems.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 hover:shadow-hover transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Interview Assistance</CardTitle>
                  <CardDescription>
                    Practice with mock interviews, get feedback on your answers, and learn how to confidently navigate remote hiring panels.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 hover:shadow-hover transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Agency Introductions</CardTitle>
                  <CardDescription>
                    We put your profile in front of vetted staffing agencies and remote-first employers actively hiring across our network.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="shadow-soft">
                <a href="/remote-work#apply-help">
                  <Send className="h-4 w-4 mr-2" />
                  Get Career Support
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Reserve Spot CTA */}
        <section className="py-16 md:py-20 bg-card">
          <div className="container mx-auto px-4 max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Reserve Your Spot
            </h2>
            <p className="text-muted-foreground mb-2 text-lg">
              Secure your seat for the May 2, 2026 webinar.
            </p>
            <p className="text-3xl font-display font-bold text-primary mb-8">
              $15 USD
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
                Pay $15 & Reserve Your Spot
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
