import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EBOOK_URL =
  "https://ezmughqpucdfuzldljtu.supabase.co/storage/v1/object/public/ebooks/Remote_Work_Beginners_Ebook.pdf";

const EbookThankYou = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke(
        "send-transactional-email",
        {
          body: {
            templateName: "ebook-download",
            recipientEmail: email.trim(),
            idempotencyKey: `ebook-download-${email.trim().toLowerCase()}-${Date.now()}`,
            templateData: { downloadUrl: EBOOK_URL },
          },
        }
      );
      if (error) throw error;
      setSent(true);
      toast({
        title: "Check your inbox!",
        description: "Your download link is on its way.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold font-serif">
              Thank you for your purchase!
            </h1>
            <p className="text-muted-foreground">
              Once your PayPal payment is complete, enter the email address you'd
              like your Remote Work Ebook download link sent to.
            </p>

            {sent ? (
              <div className="space-y-3 pt-2">
                <div className="inline-flex items-center gap-2 text-primary font-medium">
                  <Mail className="w-5 h-5" />
                  Email sent to {email}
                </div>
                <p className="text-sm text-muted-foreground">
                  Don't see it? Check your spam folder. The email may take a few
                  minutes to arrive.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="space-y-2">
                  <Label htmlFor="email">Your email address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send me the download link"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EbookThankYou;
