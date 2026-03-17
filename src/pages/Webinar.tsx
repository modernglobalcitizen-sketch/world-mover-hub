import { useState } from "react";
import { CheckCircle, Globe, Users, DollarSign, Bell, Sparkles, Headphones, Laptop, TrendingUp, MessageSquare, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { getLocalWebinarTime } from "@/lib/webinar";

const webinars = [
  {
    id: "call-center",
    title: "Call Center to Remote Career",
    date: getLocalWebinarTime(),
    tagline: "Transform your call center experience into a thriving remote career",
    description:
      "Learn how to leverage your communication skills, customer service expertise, and problem-solving abilities to land high-paying remote roles — no degree required.",
    highlights: [
      { icon: Headphones, text: "Turn your call center skills into remote-ready assets" },
      { icon: Laptop, text: "Discover remote roles perfect for your experience" },
      { icon: TrendingUp, text: "Step-by-step plan to transition from office to remote" },
      { icon: MessageSquare, text: "Build an online presence that attracts recruiters" },
      { icon: DollarSign, text: "Negotiate better pay in the remote job market" },
    ],
  },
  {
    id: "global-remote",
    title: "Building a Global Remote Career",
    tagline: "A step-by-step blueprint for building your first online income stream",
    description:
      "Designed for the global diaspora — learn how to earn online from anywhere, build invaluable skills, and create a career without borders.",
    highlights: [
      { icon: Globe, text: "Learn how to earn your first $1,000 online from anywhere" },
      { icon: Users, text: "Learn the invaluable skills AND how to use them" },
      { icon: DollarSign, text: "Step-by-step plan you can start implementing today" },
      { icon: Globe, text: "Networking virtually and building an impressive online presence" },
      { icon: Users, text: "Transferrable skills and where to find work" },
    ],
  },
];

const Webinar = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: email.trim(), name: name.trim() },
      });
      toast({ title: "You're on the list!", description: "We'll notify you when the webinar dates are announced." });
      setName("");
      setEmail("");
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <span className="inline-block mb-4 rounded-full bg-primary-foreground/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              <Sparkles className="inline h-4 w-4 mr-1 -mt-0.5" />
              Upcoming Webinars
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              Our Upcoming Webinars
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-6">
              Practical, actionable sessions designed for the global diaspora. Dates coming soon!
            </p>
          </div>
        </section>

        {/* Webinar Cards */}
        {webinars.map((webinar) => (
          <section key={webinar.id} className="py-16 md:py-20 odd:bg-background even:bg-muted/30">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                  {webinar.title}
                </h2>
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

        {/* Interest Form */}
        <section className="py-16 md:py-20 bg-card">
          <div className="container mx-auto px-4 max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Interested? Get Notified
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              We'll let you know as soon as the webinar dates and details are announced.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-4 text-left">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-semibold text-lg py-6 h-auto"
              >
                <Bell className="mr-2 h-5 w-5" />
                {isSubmitting ? "Subscribing..." : "Notify Me"}
              </Button>
            </form>

            <p className="mt-4 text-sm text-muted-foreground">
              No spam. We'll only email you about these webinars.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Webinar;
