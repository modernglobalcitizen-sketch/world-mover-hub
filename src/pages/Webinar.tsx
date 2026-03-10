import { useState } from "react";
import { getLocalWebinarTime } from "@/lib/webinar";
import { useNavigate } from "react-router-dom";
import { Play, CheckCircle, Clock, DollarSign, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CountdownTimer from "@/components/CountdownTimer";

const highlights = [
  { icon: Globe, text: "Learn how to earn your first $1,000 online from anywhere" },
  { icon: Users, text: "Learn the invaluable skills AND how to use them" },
  { icon: DollarSign, text: "Step-by-step plan you can start implementing today" },
  { icon: Clock, text: "1-hour live session with Q&A" },
  { icon: Globe, text: "Networking virtually and building an impressive online presence" },
  { icon: Users, text: "Transferrable skills and where to find work" },
];

const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  global50: { discount: 0.5, label: "50% off" },
};

const BASE_PRICE = 30;

const Webinar = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const activePromo = appliedPromo ? PROMO_CODES[appliedPromo] : null;
  const finalPrice = activePromo ? BASE_PRICE * (1 - activePromo.discount) : BASE_PRICE;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toLowerCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      toast({ title: `Promo applied — ${PROMO_CODES[code].label}!` });
    } else {
      setAppliedPromo(null);
      toast({ title: "Invalid promo code", variant: "destructive" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: email.trim(), name: name.trim() },
      });

      if (error) {
        if (import.meta.env.DEV) console.error("MailerLite subscription error:", error);
      }

      window.open("https://www.paypal.com/ncp/payment/H5SX9T4TZ4AKE", "_blank");

      toast({
        title: "Complete your payment",
        description: `A PayPal tab has opened. Pay $${finalPrice} to secure your spot.`,
      });
    } catch (err) {
      if (import.meta.env.DEV) console.error("Registration error:", err);
      window.open("https://www.paypal.com/ncp/payment/H5SX9T4TZ4AKE", "_blank");
      toast({
        title: "Complete your payment",
        description: `A PayPal tab has opened. Pay $${finalPrice} to secure your spot.`,
      });
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
              Live Webinar
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              Your First $1,000 Online Plan
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-6">
              A step-by-step blueprint for building your first online income stream — designed for the global diaspora.
            </p>
            <div className="inline-flex items-center gap-3 rounded-xl bg-primary-foreground/15 backdrop-blur-sm px-6 py-3 text-primary-foreground font-medium text-lg mb-8">
              <Clock className="h-5 w-5" />
              <span>{getLocalWebinarTime()}</span>
            </div>
            <div className="mt-8">
              <CountdownTimer />
            </div>
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

        {/* Registration Form */}
        <section className="py-16 md:py-20 bg-card">
          <div className="container mx-auto px-4 max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Ready to Start Earning Online?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Secure your spot for just{" "}
              {activePromo ? (
                <>
                  <span className="line-through text-muted-foreground/60">${BASE_PRICE}</span>{" "}
                  <span className="text-primary font-bold">${finalPrice}</span>
                </>
              ) : (
                `$${BASE_PRICE}`
              )}
              . Limited seats available.
            </p>

            <form onSubmit={handleRegister} className="space-y-4 text-left">
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
              <div>
                <Label htmlFor="promo">Promo Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="promo"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={handleApplyPromo}>
                    Apply
                  </Button>
                </div>
                {appliedPromo && (
                  <p className="text-sm text-primary mt-1 font-medium">
                    ✓ {activePromo?.label} applied
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-semibold text-lg py-6 h-auto"
              >
                <Play className="mr-2 h-5 w-5" />
                {isSubmitting ? "Processing..." : `Register & Pay $${finalPrice}`}
              </Button>
            </form>

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
