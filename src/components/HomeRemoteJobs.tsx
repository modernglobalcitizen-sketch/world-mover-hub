import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight, Bookmark, BookmarkCheck, Lock, Eye, Sparkles } from "lucide-react";
import React from "react";
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
  created_at: string;
}

const HomeRemoteJobs = () => {
  const [jobs, setJobs] = useState<AdminRemoteJob[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("remote_jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setJobs(data);
    };
    fetchJobs();
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

  const categories = useMemo(() => {
    const set = new Set(jobs.map(j => j.category).filter(Boolean));
    return Array.from(set).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const list = selectedCategory === "all"
      ? jobs
      : jobs.filter(j => j.category === selectedCategory);
    return list.slice(0, 4);
  }, [jobs, selectedCategory]);

  if (jobs.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-headline">
              <Briefcase className="inline h-7 w-7 mr-2 text-primary" />
              Remote Jobs
            </h2>
            <p className="mt-2 text-muted-foreground">
              Curated remote opportunities from around the world.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" asChild className="hidden sm:flex">
              <a href="/remote-work">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredJobs.map((job, idx) => {
            const isSaved = savedJobIds.has(job.id);
            return (
              <React.Fragment key={job.id}>
              <Card className="h-full shadow-soft hover:shadow-hover transition-all duration-300 hover:border-primary/30 flex flex-col">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg leading-snug">
                        {session ? (
                          <Link to={`/remote-jobs/${job.id}`} className="hover:text-primary transition-colors">
                            {job.title}
                          </Link>
                        ) : (
                          job.title
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1 font-medium">
                        {session ? job.company_name : null}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
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
                      {job.description.slice(0, 150)}{job.description.length > 150 ? "..." : ""}
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
                  <div className="flex items-center justify-between pt-2 mt-auto gap-2">
                    <span className="text-xs text-muted-foreground">
                      Posted {formatDate(job.created_at)}
                    </span>
                    {session ? (
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/remote-jobs/${job.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" asChild>
                        <a href="/auth">
                          <Lock className="h-3 w-3 mr-1" />
                          Sign up to View
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              {idx === 2 && (
                <div className="md:col-span-2 rounded-xl bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground p-6 md:p-8 shadow-hover border border-primary/30">
                  <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
                    <div className="flex-1 space-y-2">
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Stand Out
                      </Badge>
                      <h3 className="text-xl md:text-2xl font-display font-bold leading-snug">
                        Over 100+ people just applied to this role. Are you prepared to beat them?
                      </h3>
                      <p className="text-primary-foreground/85 text-sm md:text-base">
                        The 2026 Remote Job Beginner Checklist gives you the mindset, resume, portfolio, and LinkedIn edge to rise to the top of the pile.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <Button asChild size="lg" variant="secondary" className="gap-2 font-semibold">
                        <Link to="/ebooks">
                          Get the Checklist — $10
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Button size="lg" asChild className="shadow-hover text-base font-semibold px-8 py-6">
            <a href="/remote-work">
              View All Remote Jobs
              <ArrowRight className="h-5 w-5 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeRemoteJobs;
