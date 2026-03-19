import { useState } from "react";
import { Star, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SERVICES = [
  "Webinar",
  "Resources",
  "Breakout Rooms",
  "Ebook",
  "Remote Jobs",
  "Overall Experience",
];

const StarRating = ({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (r: number) => void;
}) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-8 w-8 cursor-pointer transition-colors ${
          star <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground/30 hover:text-yellow-400"
        }`}
        onClick={() => onRate(star)}
      />
    ))}
  </div>
);

const Review = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !service || !rating || !text) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews" as any).insert({
        reviewer_name: name.trim(),
        reviewer_email: email.trim() || null,
        service,
        rating,
        review_text: text.trim(),
      } as any);
      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast({ title: "Failed to submit review. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-lg">
          {submitted ? (
            <div className="text-center space-y-6 py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Thank You!
              </h1>
              <p className="text-muted-foreground text-lg">
                Your review has been submitted and will appear on our site once approved. We appreciate your feedback!
              </p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Submit Another Review
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                  Share Your Experience
                </h1>
                <p className="text-muted-foreground text-lg">
                  We'd love to hear about your experience with Global Moves. Your review helps others in the community!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 bg-card text-card-foreground rounded-2xl p-6 md:p-8 shadow-lg border border-border/60">
                <div className="space-y-2">
                  <Label htmlFor="rev-name">Your Name *</Label>
                  <Input
                    id="rev-name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rev-email">Email (optional)</Label>
                  <Input
                    id="rev-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">We'll never share your email publicly.</p>
                </div>

                <div className="space-y-2">
                  <Label>Which service are you reviewing? *</Label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Your Rating *</Label>
                  <StarRating rating={rating} onRate={setRating} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rev-text">Your Review *</Label>
                  <Textarea
                    id="rev-text"
                    placeholder="Tell us about your experience..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={5}
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Review;
