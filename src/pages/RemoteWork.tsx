import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, ExternalLink, Briefcase, Wifi,
  DollarSign, Clock
} from "lucide-react";

interface RemoteJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string | null;
  category: string;
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

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

const JOB_CATEGORIES = [
  { value: "software-dev", label: "Software Development" },
  { value: "customer-support", label: "Customer Support" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "product", label: "Product" },
  { value: "business", label: "Business" },
  { value: "data", label: "Data" },
  { value: "devops", label: "DevOps / Sysadmin" },
  { value: "finance", label: "Finance / Legal" },
  { value: "human-resources", label: "Human Resources" },
  { value: "qa", label: "QA" },
  { value: "writing", label: "Writing" },
  { value: "all-others", label: "All Others" },
];

const RESOURCES = [
  {
    icon: Globe,
    title: "Digital Nomad Visas",
    description: "Countries offering special visas for remote workers — from Portugal to Barbados.",
    link: "/ebooks",
  },
  {
    icon: DollarSign,
    title: "Cost of Living Comparison",
    description: "Compare living costs across popular remote work destinations worldwide.",
    link: "https://www.numbeo.com/cost-of-living/",
    external: true,
  },
  {
    icon: Wifi,
    title: "Coworking Spaces",
    description: "Find coworking spaces in cities around the globe for productive work sessions.",
    link: "https://www.coworker.com/",
    external: true,
  },
  {
    icon: Shield,
    title: "Tax & Legal Guides",
    description: "Understand tax implications and legal requirements for working remotely abroad.",
    link: "/resources",
  },
  {
    icon: Users,
    title: "Community & Networking",
    description: "Join our breakout rooms to connect with other remote workers and global movers.",
    link: "/breakout-rooms",
  },
  {
    icon: BookOpen,
    title: "Remote Work Ebooks",
    description: "In-depth guides on visas, relocation, and building a location-independent career.",
    link: "/ebooks",
  },
];

const RemoteWork = () => {
  const [jobs, setJobs] = useState<RemoteJob[]>([]);
  const [adminJobs, setAdminJobs] = useState<AdminRemoteJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch admin-added jobs
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
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const body: Record<string, unknown> = { limit: 40 };
        if (selectedCategory !== "all") body.category = selectedCategory;
        if (debouncedSearch) body.search = debouncedSearch;

        const { data, error } = await supabase.functions.invoke("fetch-remote-jobs", { body });

        if (error) throw error;
        setJobs(data?.jobs || []);
      } catch (err) {
        if (import.meta.env.DEV) console.error("Failed to fetch remote jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [selectedCategory, debouncedSearch]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[var(--hero-gradient)] opacity-90" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
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
        {adminJobs.length > 0 && (
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
        )}

        <section className="py-16 md:py-24">
          <div className="container space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-headline">
                <Briefcase className="inline h-7 w-7 mr-2 text-primary" />
                Remote Job Listings
              </h2>
              <p className="mt-2 text-muted-foreground">
                Live remote jobs sourced from across the web. Updated regularly.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {JOB_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Job Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="h-[200px]">
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p className="text-lg">No remote jobs found matching your criteria.</p>
                <p className="text-sm mt-1">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <a
                    key={job.id}
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <Card className="h-full shadow-soft hover:shadow-hover transition-all duration-300 group-hover:border-primary/30">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          {job.company_logo ? (
                            <img
                              src={job.company_logo}
                              alt={job.company_name}
                              className="h-10 w-10 rounded-md object-contain bg-muted p-1 shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                              <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                          )}
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
                          <Badge variant="secondary">{job.category}</Badge>
                          {job.job_type && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {job.job_type}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {stripHtml(job.description).slice(0, 150)}...
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          {job.candidate_required_location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.candidate_required_location}
                            </span>
                          )}
                          {job.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />
                              {job.salary}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">
                            Posted {formatDate(job.publication_date)}
                          </span>
                          <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:underline">
                            Apply <ExternalLink className="h-3 w-3" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Resources */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-headline">
                <BookOpen className="inline h-7 w-7 mr-2 text-primary" />
                Remote Work Resources
              </h2>
              <p className="mt-2 text-muted-foreground">
                Everything you need to work remotely from anywhere in the world.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {RESOURCES.map((resource) => {
                const Icon = resource.icon;
                const linkProps = resource.external
                  ? { href: resource.link, target: "_blank", rel: "noopener noreferrer" }
                  : { href: resource.link };

                return (
                  <a key={resource.title} {...linkProps} className="block group">
                    <Card className="h-full shadow-soft hover:shadow-hover transition-all duration-300 group-hover:border-primary/30">
                      <CardHeader>
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {resource.title}
                          {resource.external && <ExternalLink className="inline h-3.5 w-3.5 ml-1.5 opacity-50" />}
                        </CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RemoteWork;
