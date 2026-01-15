import { useState } from "react";
import { Heart, Calendar, Repeat, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type DonationFrequency = "one-time" | "monthly" | "quarterly";

const suggestedAmounts = [10, 25, 50, 100, 250, 500];

const frequencyOptions = [
  { value: "one-time" as DonationFrequency, label: "One Time", icon: Heart, description: "Make a single donation" },
  { value: "monthly" as DonationFrequency, label: "Monthly", icon: Repeat, description: "Donate every month" },
  { value: "quarterly" as DonationFrequency, label: "Quarterly", icon: Calendar, description: "Donate every 3 months" },
];

const Donate = () => {
  const [frequency, setFrequency] = useState<DonationFrequency>("one-time");
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setIsCustom(true);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setAmount(numValue);
    }
  };

  const handleDonate = () => {
    const finalAmount = isCustom ? parseFloat(customAmount) : amount;
    
    if (isNaN(finalAmount) || finalAmount < 10) {
      toast.error("Minimum donation amount is $10");
      return;
    }

    // TODO: Integrate with Stripe
    toast.info("Stripe integration coming soon! Thank you for your interest in donating.");
  };

  const finalAmount = isCustom ? parseFloat(customAmount) || 0 : amount;
  const isValidAmount = finalAmount >= 10;

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
              Support the Diaspora Community
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your donation helps us provide resources, opportunities, and support to community members 
              pursuing international experiences and global mobility.
            </p>
          </div>
        </section>

        {/* Donation Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Make a Donation</CardTitle>
                <CardDescription>
                  Choose your donation frequency and amount. Minimum donation is $10.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Frequency Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Donation Frequency</Label>
                  <RadioGroup
                    value={frequency}
                    onValueChange={(value) => setFrequency(value as DonationFrequency)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {frequencyOptions.map((option) => (
                      <Label
                        key={option.value}
                        htmlFor={option.value}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          frequency === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                        <option.icon className={`h-6 w-6 mb-2 ${frequency === option.value ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">{option.description}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Amount Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Donation Amount</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {suggestedAmounts.map((suggestedAmount) => (
                      <Button
                        key={suggestedAmount}
                        type="button"
                        variant={!isCustom && amount === suggestedAmount ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handleAmountSelect(suggestedAmount)}
                      >
                        ${suggestedAmount}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Custom Amount */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min="10"
                        placeholder="Custom amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className={`pl-9 ${isCustom ? "ring-2 ring-primary" : ""}`}
                      />
                    </div>
                  </div>
                  {isCustom && finalAmount < 10 && finalAmount > 0 && (
                    <p className="text-sm text-destructive">Minimum donation is $10</p>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-muted/50 rounded-lg p-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Donation Amount</span>
                    <span className="font-semibold text-lg">${isValidAmount ? finalAmount.toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Frequency</span>
                    <span className="font-medium capitalize">{frequency.replace("-", " ")}</span>
                  </div>
                  {frequency !== "one-time" && (
                    <p className="text-xs text-muted-foreground pt-2 border-t">
                      You will be charged ${isValidAmount ? finalAmount.toFixed(2) : "0.00"} {frequency === "monthly" ? "every month" : "every 3 months"} until you cancel.
                    </p>
                  )}
                </div>

                {/* Donate Button */}
                <Button 
                  size="lg" 
                  className="w-full text-lg py-6"
                  onClick={handleDonate}
                  disabled={!isValidAmount}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Donate ${isValidAmount ? finalAmount.toFixed(2) : "0.00"} {frequency !== "one-time" && frequency}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Your donation is secure and helps support our community programs.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-8">Your Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">$25</div>
                <p className="text-muted-foreground">Helps provide resources for one member's application</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">$100</div>
                <p className="text-muted-foreground">Supports a member's visa documentation process</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">$500</div>
                <p className="text-muted-foreground">Contributes to the Community Fund for travel support</p>
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
