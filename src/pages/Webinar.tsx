import { Play, CheckCircle, Clock, DollarSign, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const highlights = [
  { icon: Globe, text: "Learn how to earn your first $1,000 online from anywhere" },
  { icon: Users, text: "Learn the invaluable skills AND how to use them" },
  { icon: DollarSign, text: "Step-by-step plan you can start implementing today" },
  { icon: Clock, text: "1-hour live session with Q&A" },
  { icon: Globe, text: "Networking virtually and building an impressive online presence" },
  { icon: Users, text: "Transferrable skills and where to find work" },
];

const Webinar = () => {
  const handleRegister = () => {
    window.open("https://www.paypal.com/ncp/payment/H5SX9T4TZ4AKE", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <span className="inline-block mb-4 rounded-full bg-primary-foreground/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              Live Webinar
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              Your First $1,000 Online Plan
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-8">
              A step-by-step blueprint for building your first online income stream — designed for the global diaspora.
            </p>
            <Button size="lg" onClick={handleRegister} className="bg-primary-foreground text-secondary hover:bg-primary-foreground/90 font-semibold text-lg px-10 py-6 h-auto">
              <Play className="mr-2 h-5 w-5" />
              Register Now — $25
            </Button>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">
              What You'll Get
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {highlights.map((item, i) => (
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

        {/* CTA */}
        <section className="py-16 md:py-20 bg-card">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Ready to Start Earning Online?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Secure your spot for just $25. Limited seats available.
            </p>
            <Button size="lg" onClick={handleRegister} className="font-semibold text-lg px-10 py-6 h-auto">
              Register & Pay $25
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Secure payment via PayPal. Confirmation sent to your email.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Webinar;
