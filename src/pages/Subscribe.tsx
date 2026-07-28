import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";

const PERKS = [
  "Save jobs and opportunities to your dashboard",
  "Email notifications of new jobs",
  "Early access to webinars and resources",
];

const Subscribe = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Become a Member — Free | Global Moves Network"
        description="Join Global Moves Network for free. Unlock opportunities, remote jobs, and resources to access international careers."
        path="/subscribe"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
            Become a Member
          </h1>
          <p className="text-lg text-muted-foreground">
            Unlock everything Global Moves Network offers.
          </p>
        </div>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Membership</CardTitle>
            <CardDescription>Free to join. No payment required.</CardDescription>
            <div className="mt-4">
              <span className="text-5xl font-bold text-primary">Free</span>
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

            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-1">Why join?</h3>
              <p className="text-sm text-muted-foreground">
                All jobs are verified by a real person, so you only see opportunities worth your time.
              </p>
            </div>

            <Button asChild className="w-full" size="lg">
              <Link to="/auth">Create your free account</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Subscribe;
