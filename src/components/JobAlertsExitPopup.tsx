import { useState, useEffect } from "react";
import { X, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DISMISS_KEY = "job_alerts_exit_popup_dismissed";

const JobAlertsExitPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    let triggered = false;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setIsVisible(true);
    };

    // Desktop: exit-intent (mouse leaves toward top of viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    // Mobile/fallback: trigger after 30s or on scroll past 50%
    const fallbackTimer = setTimeout(trigger, 30000);

    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled / total > 0.5) trigger();
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: email.trim(), name: name.trim() },
      });

      if (error) throw error;

      toast({
        title: "You're on the list! 🎯",
        description: "We'll send remote job alerts straight to your inbox.",
      });
      handleDismiss();
    } catch (err) {
      if (import.meta.env.DEV) console.error("Job alerts signup error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative mx-4 w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-xl animate-in zoom-in-95 duration-300">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Briefcase className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground">
            Before you go — get remote job alerts
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Hand-picked remote jobs and global opportunities, delivered to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Send me job alerts"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default JobAlertsExitPopup;
