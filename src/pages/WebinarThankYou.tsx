import { CheckCircle, Mail, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const WebinarThankYou = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-10 pb-8 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-foreground">
                  Thank You for Registering!
                </h1>
                <p className="text-lg text-muted-foreground">
                  You're all set for <strong>Your First $1,000 Online Plan</strong> webinar.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5 text-sm text-muted-foreground space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-left">
                    Instructions on how to access the webinar will be sent to your email shortly. Please check your inbox (and spam folder, just in case).
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                If you haven't completed your payment yet, please click below to finish registration.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => window.open("https://www.paypal.com/ncp/payment/H5SX9T4TZ4AKE", "_blank")}
                >
                  Complete Payment
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WebinarThankYou;
