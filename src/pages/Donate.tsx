import { useState } from "react";
import { Heart, Users, Globe, Gift, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PAYPAL_DONATE_URL = "https://www.paypal.com/donate/?hosted_button_id=YOUR_BUTTON_ID";

const donationAmounts = [10, 25, 50, 100, 250];

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState<"once" | "monthly">("once");

  const handleDonate = () => {
    // PayPal donation page
    window.open("https://www.paypal.com/ncp/payment/KC97XC2UMQRYU", "_blank");
  };

  const displayAmount = selectedAmount || parseInt(customAmount) || 0;

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
              Support the Community Fund
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your donation goes directly to our Community Fund, which provides monthly 
              financial support to selected members pursuing global opportunities. Every 
              contribution helps someone take their next step.
            </p>
          </div>
        </section>

        {/* Donation Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">Make a Donation</CardTitle>
                <CardDescription>
                  Choose your donation type and amount
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Donation Type Tabs */}
                <Tabs 
                  value={donationType} 
                  onValueChange={(v) => setDonationType(v as "once" | "monthly")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="once" className="flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      One-time
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Monthly
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="once" className="mt-6">
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Make a one-time contribution to support our community
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="monthly" className="mt-6">
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Set up a recurring monthly donation for ongoing support
                    </p>
                  </TabsContent>
                </Tabs>

                {/* Amount Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">Select Amount (USD)</label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {donationAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount ? "default" : "outline"}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                        className="h-12"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Custom Amount */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      placeholder="Other amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      className="w-full h-12 pl-8 pr-4 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      min="1"
                    />
                  </div>
                </div>

                {/* Donate Button */}
                <div className="pt-4">
                  <Button 
                    size="lg" 
                    className="w-full text-lg py-6"
                    onClick={handleDonate}
                    disabled={!displayAmount}
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    {donationType === "monthly" ? "Donate" : "Donate"} ${displayAmount || "..."}{donationType === "monthly" ? "/month" : ""}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Secure payment via PayPal. {donationType === "monthly" && "Cancel anytime."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-8">How the Community Fund Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-3">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Monthly Support</h3>
                <p className="text-muted-foreground">
                  Each month, selected community members receive financial support for their global pursuits
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Visa & Travel</h3>
                <p className="text-muted-foreground">
                  Cover visa application fees, travel costs, and proof of funds for international opportunities
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Transparent Use</h3>
                <p className="text-muted-foreground">
                  All fund usage is tracked transparently so you can see exactly how donations help
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Thank You Note */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <p className="text-muted-foreground italic">
              "From the diaspora, for the diaspora — your generosity powers dreams and 
              opens doors for community members around the world."
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              — The Global Moves Network
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;
