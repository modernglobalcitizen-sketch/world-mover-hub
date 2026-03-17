import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bell, ArrowRight, Sparkles } from "lucide-react";

const WebinarBanner = () => {
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
        body: { email: email.trim(), name: "" },
      });
      toast({ title: "You're on the list!", description: "We'll notify you when the webinar is announced." });
      setEmail("");
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-foreground/5 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-primary-foreground/5 blur-2xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <span className="inline-block mb-5 rounded-full bg-primary-foreground/20 px-5 py-1.5 text-sm font-semibold tracking-wide uppercase text-primary-foreground backdrop-blur-sm">
          <Sparkles className="inline h-4 w-4 mr-1 -mt-0.5" />
          Upcoming Webinar
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
          Call Center to Remote Career
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-10">
          Transform your call center experience into a thriving remote career — learn the skills, strategies, and steps to break free. Sign up to be notified when we announce the date.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-5">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-primary-foreground/15 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 h-12"
          />
          <Button variant="hero" size="lg" type="submit" disabled={isSubmitting} className="group h-12 whitespace-nowrap">
            <Bell className="h-4 w-4 transition-transform group-hover:scale-110" />
            {isSubmitting ? "Subscribing..." : "Notify Me"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        <p className="text-sm text-primary-foreground/60">
          We'll email you when the date is set. No spam, ever.
        </p>
      </div>
    </section>
  );
};

export default WebinarBanner;
