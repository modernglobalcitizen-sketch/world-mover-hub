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
import SEO from "@/components/SEO";

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
      {job && (
        <SEO
          title={`${job.title} — Remote Job`}
          description={(job.description || `${job.title} — remote ${job.job_type} role at ${job.company_name}.`).replace(/<[^>]+>/g, "").slice(0, 160)}
          path={`/remote-jobs/${job.id}`}
          type="article"
        />
      )}
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
                      <span className="font-medium">Confidential</span>
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
                      <h3 className="font-semibold text-foreground mb-2">Members only</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Become a member for $3/month to unlock application links and apply to remote jobs.
                      </p>
                      <Button asChild>
                        <Link to="/subscribe">Become a Member — $3/month</Link>
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

// Auto-formats plain-text job descriptions into readable paragraphs,
// bullet lists, and section headings.
const FormattedDescription = ({ text }: { text: string }) => {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  // Split into blocks separated by blank lines
  const blocks = normalized.split(/\n\s*\n/);

  const isBulletLine = (line: string) => /^\s*([-*•·▪►●]|\d+[.)])\s+/.test(line);
  const stripBullet = (line: string) => line.replace(/^\s*([-*•·▪►●]|\d+[.)])\s+/, "");

  const isHeadingLine = (line: string) => {
    const t = line.trim();
    if (t.length === 0 || t.length > 80) return false;
    // Ends with colon, e.g. "Responsibilities:"
    if (/^[A-Z][\w &/'-]{1,60}:$/.test(t)) return true;
    // Short ALL CAPS line, e.g. "ABOUT THE ROLE"
    if (/^[A-Z][A-Z0-9 &/'-]{2,40}$/.test(t) && t.split(" ").length <= 6) return true;
    return false;
  };

  const renderInline = (line: string, key: number) => {
    // Auto-link plain URLs
    const parts = line.split(/(https?:\/\/[^\s)]+)/g);
    return (
      <span key={key}>
        {parts.map((part, i) =>
          /^https?:\/\//.test(part) ? (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 break-words"
            >
              {part}
            </a>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  return (
    <div className="space-y-5 text-foreground/90 leading-relaxed text-[15px] md:text-base max-w-prose">
      {blocks.map((block, bIdx) => {
        const lines = block.split("\n").filter((l) => l.trim().length > 0);
        if (lines.length === 0) return null;

        // Single heading line
        if (lines.length === 1 && isHeadingLine(lines[0])) {
          return (
            <h3
              key={bIdx}
              className="text-base md:text-lg font-display font-semibold text-headline pt-2"
            >
              {lines[0].replace(/:$/, "")}
            </h3>
          );
        }

        // Heading followed by content (heading + bullets/paragraph)
        if (isHeadingLine(lines[0]) && lines.length > 1) {
          const rest = lines.slice(1);
          const allBullets = rest.every(isBulletLine);
          return (
            <div key={bIdx} className="space-y-2">
              <h3 className="text-base md:text-lg font-display font-semibold text-headline pt-2">
                {lines[0].replace(/:$/, "")}
              </h3>
              {allBullets ? (
                <ul className="list-disc pl-5 space-y-1.5 marker:text-primary">
                  {rest.map((l, i) => (
                    <li key={i}>{renderInline(stripBullet(l), i)}</li>
                  ))}
                </ul>
              ) : (
                <p>{rest.map((l, i) => renderInline(l + (i < rest.length - 1 ? " " : ""), i))}</p>
              )}
            </div>
          );
        }

        // Bullet list block
        if (lines.every(isBulletLine)) {
          return (
            <ul key={bIdx} className="list-disc pl-5 space-y-1.5 marker:text-primary">
              {lines.map((l, i) => (
                <li key={i}>{renderInline(stripBullet(l), i)}</li>
              ))}
            </ul>
          );
        }

        // Default paragraph (join wrapped lines with a space)
        return (
          <p key={bIdx}>
            {lines.map((l, i) => renderInline(l + (i < lines.length - 1 ? " " : ""), i))}
          </p>
        );
      })}
    </div>
  );
};


export default RemoteJobDetail;
