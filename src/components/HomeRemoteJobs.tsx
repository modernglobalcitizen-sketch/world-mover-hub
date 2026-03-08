import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink, ArrowRight } from "lucide-react";

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

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("remote_jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setJobs(data);
    };
    fetchJobs();
  }, []);

  if (jobs.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-display font-bold text-headline">
              <Briefcase className="inline h-7 w-7 mr-2 text-primary" />
              Remote Jobs
            </h2>
            <p className="mt-2 text-muted-foreground">
              Curated remote opportunities from around the world.
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <a href="/remote-work">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <a
              key={job.id}
              href={job.apply_url || "/remote-work"}
              target={job.apply_url ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="h-full shadow-soft hover:shadow-hover transition-all duration-300 group-hover:border-primary/30">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="mt-1 font-medium">
                        {job.company_name}
                      </CardDescription>
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
                <CardContent className="space-y-3">
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
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      Posted {formatDate(job.created_at)}
                    </span>
                    {job.apply_url && (
                      <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:underline">
                        Apply <ExternalLink className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <div className="text-center sm:hidden">
          <Button variant="outline" asChild>
            <a href="/remote-work">
              View All Remote Jobs
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeRemoteJobs;
