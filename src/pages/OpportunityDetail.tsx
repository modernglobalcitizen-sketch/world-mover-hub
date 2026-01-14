import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, ExternalLink, ArrowLeft, Bookmark, BookmarkCheck, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import ShareOpportunityDialog from "@/components/ShareOpportunityDialog";

interface Opportunity {
  id: string;
  title: string;
  about: string;
  category: string;
  location: string | null;
  deadline: string | null;
  requirements: string | null;
  eligibility: string | null;
  benefits: string | null;
  link: string | null;
  is_active: boolean;
}

const OpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

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
    const fetchOpportunity = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error) {
        console.error("Error fetching opportunity:", error);
      } else {
        setOpportunity(data);
      }
      setLoading(false);
    };

    fetchOpportunity();
  }, [id]);

  useEffect(() => {
    if (!session || !id) {
      setIsSaved(false);
      setHasApplied(false);
      return;
    }

    const fetchUserData = async () => {
      const [savedResult, appResult] = await Promise.all([
        supabase
          .from("saved_opportunities")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("opportunity_id", id)
          .maybeSingle(),
        supabase
          .from("applications")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("opportunity_id", id)
          .maybeSingle(),
      ]);

      setIsSaved(!!savedResult.data);
      setHasApplied(!!appResult.data);
    };

    fetchUserData();
  }, [session, id]);

  const handleSave = async () => {
    if (!session || !opportunity) {
      toast.error("Please log in to save opportunities");
      return;
    }

    setSavingId(opportunity.id);

    if (isSaved) {
      const { error } = await supabase
        .from("saved_opportunities")
        .delete()
        .eq("user_id", session.user.id)
        .eq("opportunity_id", opportunity.id);

      if (error) {
        toast.error("Failed to unsave opportunity");
        console.error(error);
      } else {
        setIsSaved(false);
        toast.success("Opportunity removed from saved");
      }
    } else {
      const { error } = await supabase
        .from("saved_opportunities")
        .insert({
          user_id: session.user.id,
          opportunity_id: opportunity.id,
        });

      if (error) {
        toast.error("Failed to save opportunity");
        console.error(error);
      } else {
        setIsSaved(true);
        toast.success("Opportunity saved! View it on your dashboard.");
      }
    }

    setSavingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center text-muted-foreground">Loading opportunity...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Opportunity Not Found</h1>
            <p className="text-muted-foreground mb-6">This opportunity may have been removed or is no longer available.</p>
            <Button asChild>
              <Link to="/opportunities">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Opportunities
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isExpired = opportunity.deadline && new Date(opportunity.deadline) < new Date();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/opportunities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Opportunities
            </Link>
          </Button>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">
                {opportunity.category}
              </Badge>
              {hasApplied && (
                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Applied
                </Badge>
              )}
              {isExpired && (
                <Badge variant="destructive">Deadline Passed</Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-headline mb-4">
              {opportunity.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-muted-foreground mb-8">
              {opportunity.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {opportunity.location}
                </span>
              )}
              {opportunity.deadline && (
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Deadline: {format(new Date(opportunity.deadline), "MMMM d, yyyy")}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {opportunity.link && (
                <Button asChild size="lg">
                  <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
              {session && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleSave}
                    disabled={savingId === opportunity.id}
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                  <ShareOpportunityDialog
                    opportunityId={opportunity.id}
                    opportunityTitle={opportunity.title}
                  />
                </>
              )}
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">About</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.about}</p>
                </div>

                {opportunity.eligibility && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Eligibility</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.eligibility}</p>
                  </div>
                )}

                {opportunity.requirements && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.requirements}</p>
                  </div>
                )}

                {opportunity.benefits && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Benefits</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.benefits}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {opportunity.link && (
              <div className="mt-8 text-center">
                <Button asChild size="lg">
                  <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OpportunityDetail;
