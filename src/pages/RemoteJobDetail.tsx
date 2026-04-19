import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase, MapPin, DollarSign, Clock, ExternalLink,
  ArrowLeft, Bookmark, BookmarkCheck, Lock, Building2, CalendarDays,
} from "lucide-react";
import { toast } from "sonner";

interface RemoteJob {
  id: string;
  title: string;
  company_name: string;
  category: string;
  job_type: string;
  location: string;
  salary: string | null;
  description: string;
  apply_url: string | null;
  created_at: string;
  is_active: boolean;
}

const RemoteJobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<RemoteJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("remote_jobs")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();
      setJob(data as RemoteJob | null);
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (!session || !id) {
      setIsSaved(false);
      return;
    }
    const fetchSaved = async () => {
      const { data } = await supabase
        .from("saved_remote_jobs")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("remote_job_id", id)
        .maybeSingle();
      setIsSaved(!!data);
    };
    fetchSaved();
  }, [session, id]);

  const handleToggleSave = async () => {
    if (!session || !job) {
      toast.error("Please sign in to save remote jobs");
      return;
    }
    setSavingToggle(true);
    if (isSaved) {
      const { error } = await supabase
        .from("saved_remote_jobs")
        .delete()
        .eq("user_id", session.user.id)
        .eq("remote_job_id", job.id);
      if (error) toast.error("Failed to unsave");
      else { setIsSaved(false); toast.success("Removed from saved"); }
    } else {
      const { error } = await supabase
        .from("saved_remote_jobs")
        .insert({ user_id: session.user.id, remote_job_id: job.id });
      if (error) toast.error("Failed to save");
      else { setIsSaved(true); toast.success("Saved to your dashboard!"); }
    }
    setSavingToggle(false);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10 md:py-16">
        <div className="container max-w-4xl">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : !job ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
                <h1 className="text-2xl font-display font-bold text-headline mb-2">Job Not Found</h1>
                <p className="text-muted-foreground mb-6">This job may no longer be available.</p>
                <Button asChild>
                  <Link to="/remote-work">Browse Remote Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-soft">
              <CardContent className="p-6 md:p-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="h-7 w-7 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-headline leading-tight">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{job.company_name}</span>
                    </div>
                  </div>
                  {session && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleSave}
                      disabled={savingToggle}
                      className="shrink-0"
                    >
                      {isSaved ? (
                        <><BookmarkCheck className="h-4 w-4 mr-1 text-primary" /> Saved</>
                      ) : (
                        <><Bookmark className="h-4 w-4 mr-1" /> Save</>
                      )}
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.category && <Badge variant="secondary">{job.category}</Badge>}
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {job.job_type}
                  </Badge>
                  <Badge variant="outline">
                    <MapPin className="h-3 w-3 mr-1" />
                    {job.location}
                  </Badge>
                  {job.salary && (
                    <Badge variant="outline">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {job.salary}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border pt-4">
                  <CalendarDays className="h-4 w-4" />
                  Posted {formatDate(job.created_at)}
                </div>

                <div>
                  <h2 className="text-xl font-display font-semibold text-headline mb-4">Job Description</h2>
                  {job.description ? (
                    <FormattedDescription text={job.description} />
                  ) : (
                    <p className="text-muted-foreground italic">No description provided.</p>
                  )}
                </div>

                <div className="border-t border-border pt-6">
                  {session ? (
                    job.apply_url ? (
                      <Button size="lg" asChild className="w-full sm:w-auto">
                        <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                          Apply Now <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    ) : (
                      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                        See the job description above for application instructions.
                      </div>
                    )
                  ) : (
                    <div className="bg-accent/50 rounded-lg p-6 text-center border border-border">
                      <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold text-foreground mb-2">Sign in to apply</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create a free account to access the application link.
                      </p>
                      <Button asChild>
                        <Link to="/auth">Sign Up Free</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RemoteJobDetail;
