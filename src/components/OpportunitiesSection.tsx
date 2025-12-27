import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, ArrowRight, CheckCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  deadline: string | null;
  requirements: string | null;
  is_active: boolean;
}

const OpportunitiesSection = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchOpportunities = async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching opportunities:", error);
      } else {
        setOpportunities(data || []);
      }
      setLoading(false);
    };

    fetchOpportunities();
  }, []);

  useEffect(() => {
    if (!session) {
      setAppliedIds(new Set());
      setSavedIds(new Set());
      return;
    }

    const fetchUserData = async () => {
      const [appResult, savedResult] = await Promise.all([
        supabase
          .from("applications")
          .select("opportunity_id")
          .eq("user_id", session.user.id),
        supabase
          .from("saved_opportunities")
          .select("opportunity_id")
          .eq("user_id", session.user.id),
      ]);

      if (appResult.data) {
        setAppliedIds(new Set(appResult.data.map(a => a.opportunity_id)));
      }
      if (savedResult.data) {
        setSavedIds(new Set(savedResult.data.map(s => s.opportunity_id)));
      }
    };

    fetchUserData();
  }, [session]);

  const handleApply = async () => {
    if (!session || !selectedOpportunity) {
      toast.error("Please log in to apply");
      return;
    }

    setApplyingTo(selectedOpportunity.id);

    const { error } = await supabase
      .from("applications")
      .insert({
        user_id: session.user.id,
        opportunity_id: selectedOpportunity.id,
        message: message.trim() || null,
      });

    if (error) {
      if (error.code === "23505") {
        toast.error("You've already applied to this opportunity");
      } else {
        toast.error("Failed to submit application");
        console.error(error);
      }
    } else {
      toast.success("Application submitted successfully!");
      setAppliedIds(new Set([...appliedIds, selectedOpportunity.id]));
      setDialogOpen(false);
      setMessage("");
    }

    setApplyingTo(null);
  };

  const openApplyDialog = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setMessage("");
    setDialogOpen(true);
  };

  const handleSave = async (opportunityId: string) => {
    if (!session) {
      toast.error("Please log in to save opportunities");
      return;
    }

    setSavingId(opportunityId);
    const isSaved = savedIds.has(opportunityId);

    if (isSaved) {
      const { error } = await supabase
        .from("saved_opportunities")
        .delete()
        .eq("user_id", session.user.id)
        .eq("opportunity_id", opportunityId);

      if (error) {
        toast.error("Failed to unsave opportunity");
        console.error(error);
      } else {
        const newSaved = new Set(savedIds);
        newSaved.delete(opportunityId);
        setSavedIds(newSaved);
        toast.success("Opportunity removed from saved");
      }
    } else {
      const { error } = await supabase
        .from("saved_opportunities")
        .insert({
          user_id: session.user.id,
          opportunity_id: opportunityId,
        });

      if (error) {
        toast.error("Failed to save opportunity");
        console.error(error);
      } else {
        setSavedIds(new Set([...savedIds, opportunityId]));
        toast.success("Opportunity saved! View it on your dashboard.");
      }
    }

    setSavingId(null);
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center text-muted-foreground">Loading opportunities...</div>
        </div>
      </section>
    );
  }

  if (opportunities.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-headline">
              Opportunities Hub
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore curated global opportunities available to our community members. Save opportunities to track them on your dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => {
              const hasApplied = appliedIds.has(opportunity.id);
              const isSaved = savedIds.has(opportunity.id);
              const isExpired = opportunity.deadline && new Date(opportunity.deadline) < new Date();

              return (
                <Card key={opportunity.id} className="shadow-soft hover:shadow-hover transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="secondary" className="mb-2">
                        {opportunity.category}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {hasApplied && (
                          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Applied
                          </Badge>
                        )}
                        {session && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleSave(opportunity.id)}
                            disabled={savingId === opportunity.id}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="h-5 w-5 text-primary" />
                            ) : (
                              <Bookmark className="h-5 w-5" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {opportunity.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {opportunity.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {opportunity.location}
                        </span>
                      )}
                      {opportunity.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(opportunity.deadline), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>

                    {session ? (
                      hasApplied ? (
                        <Button variant="secondary" disabled className="w-full">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Application Submitted
                        </Button>
                      ) : isExpired ? (
                        <Button variant="secondary" disabled className="w-full">
                          Deadline Passed
                        </Button>
                      ) : (
                        <Dialog open={dialogOpen && selectedOpportunity?.id === opportunity.id} onOpenChange={(open) => {
                          if (!open) setDialogOpen(false);
                        }}>
                          <DialogTrigger asChild>
                            <Button className="w-full" onClick={() => openApplyDialog(opportunity)}>
                              Apply Now
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Apply for {opportunity.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                                <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                                {opportunity.requirements && (
                                  <div className="pt-2 border-t border-border">
                                    <p className="text-xs font-medium text-foreground mb-1">Requirements:</p>
                                    <p className="text-xs text-muted-foreground">{opportunity.requirements}</p>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="message">Why are you interested? (optional)</Label>
                                <Textarea
                                  id="message"
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  placeholder="Tell us briefly why you'd like to pursue this opportunity..."
                                  rows={4}
                                />
                              </div>
                              <Button 
                                onClick={handleApply} 
                                className="w-full" 
                                disabled={applyingTo === opportunity.id}
                              >
                                {applyingTo === opportunity.id ? "Submitting..." : "Submit Application"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )
                    ) : (
                      <Button variant="outline" asChild className="w-full">
                        <a href="/auth">
                          Login to Apply
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesSection;
