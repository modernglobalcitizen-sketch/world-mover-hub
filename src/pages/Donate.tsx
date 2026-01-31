import { Heart, Users, Globe, ArrowRight, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Donate = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Support the Global Moves Community
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our community of changemakers pursuing international experiences and global mobility.
              Your membership helps fund resources, opportunities, and support for members worldwide.
            </p>
          </div>
        </section>

        {/* Membership Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full w-fit mx-auto mb-4">
                  <CreditCard className="h-4 w-4" />
                  Monthly Membership
                </div>
                <CardTitle className="text-4xl md:text-5xl font-bold">
                  $10<span className="text-xl font-normal text-muted-foreground">/month</span>
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Full access to all community features and resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Benefits */}
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Access to exclusive opportunities",
                    "Join breakout rooms & discussions",
                    "Community fund eligibility",
                    "Networking with global members",
                    "Resources & application support",
                    "Cancel anytime",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="text-center pt-4">
                  <Link to="/auth">
                    <Button size="lg" className="text-lg px-8 py-6">
                      <Heart className="mr-2 h-5 w-5" />
                      Join Now for $10/month
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-4">
                    Secure payment via PayPal. Cancel your subscription anytime.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-8">Your Membership Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-3">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Community Growth</h3>
                <p className="text-muted-foreground">
                  Helps us expand resources and support for members pursuing global opportunities
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Community Fund</h3>
                <p className="text-muted-foreground">
                  Contributes to the fund that helps members with visa and travel costs
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Global Reach</h3>
                <p className="text-muted-foreground">
                  Enables us to curate and share opportunities from around the world
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;
