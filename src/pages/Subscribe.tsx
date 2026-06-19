import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PERKS = [
  "Access to all breakout rooms & community chats",
  "Personalized opportunity matches",
  "Save jobs and opportunities to your dashboard",
  "Early access to webinars and resources",
  "Support the mission — keep the platform running",
];

const Subscribe = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const paymentStatus = searchParams.get("payment");
  const subscriptionId = searchParams.get("subscription_id");

  useEffect(() => {
    const verify = async () => {
      if (paymentStatus !== "success" || !subscriptionId) return;
      setVerifying(true);
      const { data, error } = await supabase.functions.invoke("paypal-subscription", {
        body: { action: "verify-subscription", subscriptionId },
      });
      setVerifying(false);
      if (error || !data?.verified) {
        toast.error("We couldn't confirm your subscription yet. It may take a moment.");
        return;
      }
      setVerified(true);
      toast.success("Subscription active! Welcome aboard.");
    };
    verify();
  }, [paymentStatus, subscriptionId]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("paypal-subscription", {
      body: { action: "create-subscription", email: email.trim() },
    });
    setLoading(false);
    if (error || !data?.approvalUrl) {
      toast.error("Could not start subscription. Please try again.");
      return;
    }
    window.location.href = data.approvalUrl;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Become a Member — $3/month | Global Moves Network"
        description="Join Global Moves Network for $3/month. Unlock breakout rooms, opportunities, and resources to access international careers."
        path="/subscribe"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
            Become a Member
          </h1>
          <p className="text-lg text-muted-foreground">
            Support the mission and unlock everything Global Moves Network offers.
          </p>
        </div>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Monthly Membership</CardTitle>
            <CardDescription>Cancel anytime through PayPal.</CardDescription>
            <div className="mt-4">
              <span className="text-5xl font-bold text-primary">$3</span>
              <span className="text-muted-foreground ml-1">/ month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{perk}</span>
                </li>
              ))}
            </ul>

            {verified ? (
              <div className="text-center space-y-4 pt-4">
                <p className="text-foreground font-medium">
                  🎉 Your membership is active. Thank you for supporting the community!
                </p>
                <Button asChild className="w-full">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            ) : verifying ? (
              <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirming your subscription...
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4 pt-2">
                <div>
                  <Label htmlFor="email">Your email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use the same email as your PayPal account.
                  </p>
                </div>
                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Redirecting to PayPal...
                    </>
                  ) : (
                    "Subscribe with PayPal — $3/month"
                  )}
                </Button>
                {paymentStatus === "cancelled" && (
                  <p className="text-sm text-center text-muted-foreground">
                    Payment cancelled. You can try again anytime.
                  </p>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Subscribe;
