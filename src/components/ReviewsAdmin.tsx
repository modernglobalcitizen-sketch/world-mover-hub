import { useState, useEffect } from "react";
import { Star, Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface AdminReview {
  id: string;
  reviewer_name: string;
  reviewer_email: string | null;
  service: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
}

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-3.5 w-3.5 ${
          star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
        }`}
      />
    ))}
  </div>
);

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    const { data, error } = await (supabase as any).rpc("get_reviews_admin");

    if (data) setReviews(data as unknown as AdminReview[]);
    if (error) toast.error("Failed to load reviews");
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("reviews" as any)
      .update({ is_approved: true } as any)
      .eq("id", id);

    if (error) {
      toast.error("Failed to approve review");
    } else {
      toast.success("Review approved");
      setReviews(reviews.map((r) => (r.id === id ? { ...r, is_approved: true } : r)));
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("reviews" as any)
      .update({ is_approved: false } as any)
      .eq("id", id);

    if (error) {
      toast.error("Failed to reject review");
    } else {
      toast.success("Review rejected");
      setReviews(reviews.map((r) => (r.id === id ? { ...r, is_approved: false } : r)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    const { error } = await supabase
      .from("reviews" as any)
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete review");
    } else {
      toast.success("Review deleted");
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  if (loading) {
    return <div className="text-center text-muted-foreground py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          {pendingCount > 0 && (
            <Badge variant="destructive">{pendingCount} pending</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{reviews.length} total reviews</p>
      </div>

      {reviews.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No reviews submitted yet.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="min-w-[200px]">Review</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <Badge variant={review.is_approved ? "default" : "secondary"}>
                      {review.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{review.reviewer_name}</span>
                      {review.reviewer_email && (
                        <p className="text-xs text-muted-foreground">{review.reviewer_email}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{review.service}</Badge>
                  </TableCell>
                  <TableCell>
                    <StarDisplay rating={review.rating} />
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="text-sm truncate">{review.review_text}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(review.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {!review.is_approved && (
                        <Button size="sm" variant="ghost" onClick={() => handleApprove(review.id)} title="Approve">
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {review.is_approved && (
                        <Button size="sm" variant="ghost" onClick={() => handleReject(review.id)} title="Reject">
                          <X className="h-4 w-4 text-orange-500" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(review.id)} title="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ReviewsAdmin;
