import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin, ExternalLink, Briefcase, Wifi,
  DollarSign, Clock, Bookmark, BookmarkCheck, Lock,
  Globe, Users, Send, CheckCircle
} from "lucide-react";
import { toast } from "sonner";

interface AdminRemoteJob {
  id: string;
  title: string;
  company_name: string;
  category: string;
  job_type: string;
  location: string;
  salary: string | null;
  description: string;
  apply_url: string | null;
  is_active: boolean;
  created_at: string;
}

const RemoteWork = () => {
  const [adminJobs, setAdminJobs] = useState<AdminRemoteJob[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [applyName, setApplyName] = useState("");
  const [applyEmail, setApplyEmail] = useState("");
  const [applyDetails, setApplyDetails] = useState("");
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applySubmitted, setApplySubmitted] = useState(false);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName.trim() || !applyEmail.trim()) {
      toast.error("Please fill in your name and email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applyEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setApplySubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: applyEmail.trim(), name: applyName.trim() },
      });
      if (error) throw error;
      setApplySubmitted(true);
      toast.success("Application submitted! We'll be in touch soon.");
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setApplySubmitting(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAdminJobs = async () => {
      const { data } = await supabase
        .from("remote_jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data) setAdminJobs(data);
    };
    fetchAdminJobs();
  }, []);

  useEffect(() => {
    if (!session) {
      setSavedJobIds(new Set());
      return;
    }
    const fetchSaved = async () => {
      const { data } = await supabase
        .from("saved_remote_jobs")
        .select("remote_job_id")
        .eq("user_id", session.user.id);
      if (data) setSavedJobIds(new Set(data.map((r: any) => r.remote_job_id)));
    };
    fetchSaved();
  }, [session]);

  const handleToggleSave = async (jobId: string) => {
    if (!session) {
      toast.error("Please sign in to save remote jobs");
      return;
    }
    setSavingId(jobId);
    const isSaved = savedJobIds.has(jobId);

    if (isSaved) {
      const { error } = await supabase
        .from("saved_remote_jobs")
        .delete()
        .eq("user_id", session.user.id)
        .eq("remote_job_id", jobId);
      if (error) {
        toast.error("Failed to unsave job");
      } else {
        setSavedJobIds(prev => { const next = new Set(prev); next.delete(jobId); return next; });
        toast.success("Job removed from saved");
      }
    } else {
      const { error } = await supabase
        .from("saved_remote_jobs")
        .insert({ user_id: session.user.id, remote_job_id: jobId });
      if (error) {
        toast.error("Failed to save job");
      } else {
        setSavedJobIds(prev => new Set(prev).add(jobId));
        toast.success("Job saved to your dashboard!");
      }
    }
    setSavingId(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-20" />
          <div className="container relative z-10 text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Wifi className="h-3 w-3 mr-1" />
              Work From Anywhere
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Remote Work Hub
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Discover remote job opportunities worldwide and access resources to thrive as a location-independent professional.
            </p>
            {!session && (
              <div className="mt-6">
                <Button asChild className="bg-white text-primary hover:bg-white/90">
                  <a href="/auth">Sign Up to Apply for Jobs</a>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Webinar Promo */}
        <section className="py-12 md:py-16 bg-card border-b border-border">
          <div className="container max-w-4xl">
            <div className="rounded-2xl overflow-hidden border border-primary/20 shadow-soft">
              <div className="bg-gradient-to-r from-primary via-primary/90 to-accent p-8 md:p-10 text-center">
                <Badge className="mb-4 bg-white/20 text-white border-white/30">
                  Upcoming Webinar
                </Badge>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                  Your First $1,000 Online Plan
                </h2>
                <p className="text-white/85 max-w-xl mx-auto mb-6">
                  A step-by-step blueprint for building your first online income stream — designed for the global diaspora. Date coming soon!
                </p>
                <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-white/90 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Work from anywhere</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Live Q&A session</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8">
                    <a href="/webinar">
                      Get Notified
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs (Admin-added) */}
        {adminJobs.length > 0 ? (
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-headline">
                  <Briefcase className="inline h-7 w-7 mr-2 text-primary" />
                  Featured Remote Jobs
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Hand-picked remote opportunities curated by our team.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {adminJobs.map((job) => {
                  const isSaved = savedJobIds.has(job.id);
                  return (
                    <Card key={job.id} className="h-full shadow-soft hover:shadow-hover transition-all duration-300 hover:border-primary/30 border-primary/20 flex flex-col">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-lg leading-snug">
                              {job.title}
                            </CardTitle>
                            <CardDescription className="mt-1 font-medium">
                              {job.company_name}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge className="bg-primary/10 text-primary border-primary/20">Featured</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleToggleSave(job.id)}
                              disabled={savingId === job.id}
                              title={isSaved ? "Remove from saved" : "Save to dashboard"}
                            >
                              {isSaved
                                ? <BookmarkCheck className="h-4 w-4 text-primary" />
                                : <Bookmark className="h-4 w-4 text-muted-foreground" />
                              }
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.category && <Badge variant="secondary">{job.category}</Badge>}
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {job.job_type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 flex-1 flex flex-col">
                        {job.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {job.description.slice(0, 150)}...
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                          {job.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />
                              {job.salary}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2 mt-auto">
                          <span className="text-xs text-muted-foreground">
                            Posted {formatDate(job.created_at)}
                          </span>
                          {job.apply_url ? (
                            session ? (
                              <Button size="sm" asChild>
                                <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                                  Apply <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" asChild>
                                <a href="/auth">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Sign up to Apply
                                </a>
                              </Button>
                            )
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        ) : (
          <section className="py-16 md:py-24">
            <div className="container text-center text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">No remote jobs available at the moment.</p>
              <p className="text-sm mt-1">Check back soon for new opportunities!</p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RemoteWork;
