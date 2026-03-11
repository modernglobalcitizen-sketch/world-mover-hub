import { useState, useEffect } from "react";
import { Star, Send, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SERVICES = [
  "Webinar",
  "Resources",
  "Breakout Rooms",
  "Ebook",
  "Remote Jobs",
  "Overall Experience",
];

interface Review {
  id: string;
  reviewer_name: string;
  service: string;
  rating: number;
  review_text: string;
  created_at: string;
}

const StarRating = ({
  rating,
  onRate,
  interactive = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${
          star <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground/30"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={() => interactive && onRate?.(star)}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <Card className="border-border/60 h-full">
    <CardContent className="p-6 flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2">
        <Quote className="h-4 w-4 text-primary/40 shrink-0" />
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {review.service}
        </span>
      </div>
      <StarRating rating={review.rating} />
      <p className="text-foreground text-sm leading-relaxed flex-1">
        "{review.review_text}"
      </p>
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <span className="text-sm font-medium text-foreground">
          {review.reviewer_name}
        </span>
        <span className="text-xs text-muted-foreground">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
    </CardContent>
  </Card>
);

const ReviewForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
      toast({ title: "Thank you! Your review has been submitted for approval." });
      setName("");
      setEmail("");
      setService("");
      setRating(0);
      setText("");
      onSuccess();
    } catch {
      toast({ title: "Failed to submit review. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="rev-name">Name *</Label>
        <Input id="rev-name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="rev-email">Email (optional)</Label>
        <Input id="rev-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label>Service *</Label>
        <Select value={service} onValueChange={setService}>
          <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
          <SelectContent>
            {SERVICES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Rating *</Label>
        <div className="mt-1">
          <StarRating rating={rating} onRate={setRating} interactive />
        </div>
      </div>
      <div>
        <Label htmlFor="rev-text">Your Review *</Label>
        <Textarea id="rev-text" placeholder="Share your experience..." value={text} onChange={(e) => setText(e.target.value)} rows={4} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        <Send className="mr-2 h-4 w-4" />
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews" as any)
      .select("id, reviewer_name, service, rating, review_text, created_at")
      .order("created_at", { ascending: false })
      .limit(6);
    if (data) setReviews(data as unknown as Review[]);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            What Our Community Says
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Hear from members who are building their global careers with us.
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg">
                <Star className="mr-2 h-4 w-4" />
                Leave a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Your Experience</DialogTitle>
              </DialogHeader>
              <ReviewForm onSuccess={() => { setDialogOpen(false); fetchReviews(); }} />
            </DialogContent>
          </Dialog>
        </div>

        {reviews.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No reviews yet. Be the first to share your experience!
          </p>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
