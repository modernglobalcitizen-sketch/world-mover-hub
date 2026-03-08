import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, ExternalLink, Briefcase, Wifi,
  DollarSign, Clock
} from "lucide-react";

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
                {adminJobs.map((job) => (
                  <a
                    key={job.id}
                    href={job.apply_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block group ${!job.apply_url ? "pointer-events-none" : ""}`}
                  >
                    <Card className="h-full shadow-soft hover:shadow-hover transition-all duration-300 group-hover:border-primary/30 border-primary/20">
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
                          <Badge className="bg-primary/10 text-primary border-primary/20 shrink-0">Featured</Badge>
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
