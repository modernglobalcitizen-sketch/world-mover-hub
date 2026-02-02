import { Heart, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const DonateThankYou = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-10 pb-8 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto">
                <Heart className="h-10 w-10 text-primary fill-primary" />
              </div>
              
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-foreground">
                  Thank You for Your Generosity!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Your donation makes a real difference in the lives of our community members 
                  pursuing international opportunities.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p>
                  Your contribution helps fund visa support, emergency assistance, and 
                  scholarships for those who need it most. Together, we're building bridges 
                  across borders.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild variant="outline">
                  <Link to="/donate">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Donate Again
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground mt-8 italic">
            "From the diaspora, for the diaspora — thank you for being part of this journey."
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonateThankYou;
