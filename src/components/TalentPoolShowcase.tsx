import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Sparkles, ExternalLink, UserRound, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface FeaturedTalent {
  id: string;
  industry: string;
  years_of_experience: string;
  role_current: string | null;
  role_desired: string | null;
  skills: string | null;
  education_level: string;
  portfolio_url: string | null;
  created_at: string;
}

const TalentPoolShowcase = () => {
  const [talent, setTalent] = useState<FeaturedTalent[]>([]);
  const [loading, setLoading] = useState(true);
  const [introTarget, setIntroTarget] = useState<FeaturedTalent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.rpc("get_featured_talent_pool");
      if (!error && data) setTalent(data as FeaturedTalent[]);
      setLoading(false);
    };
    load();
  }, []);

  const openIntro = (t: FeaturedTalent) => {
    setIntroTarget(t);
    setForm({ name: "", email: "", company: "", message: "" });
  };

  const submitIntro = async () => {
    if (!introTarget) return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Name, email, and message are required");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("talent_intro_requests").insert({
      talent_id: introTarget.id,
      requester_name: form.name.trim(),
      requester_email: form.email.trim().toLowerCase(),
      requester_company: form.company.trim() || null,
      message: form.message.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send your request. Please try again.");
      return;
    }
    toast.success("Intro request sent! The admin will reach out shortly.");
    setIntroTarget(null);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm">Loading featured talent…</div>
    );
  }

  if (talent.length === 0) {
    return (
      <div className="text-center py-10 px-6 rounded-lg border border-dashed bg-muted/30">
        <Sparkles className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">
          Featured talent profiles will appear here soon. Be one of the first — submit your profile below.
        </p>
      </div>
    );
  }

  const skillTags = (skills: string | null) =>
    (skills || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {talent.map((t) => (
          <Card key={t.id} className="hover:shadow-hover transition-all duration-200 border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <UserRound className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-headline leading-tight">
                    {t.role_desired?.split(",")[0]?.trim() || t.role_current || "Open to opportunities"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Anonymous profile · {t.industry}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Briefcase className="h-3 w-3" /> {t.years_of_experience}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <GraduationCap className="h-3 w-3" /> {t.education_level}
                </Badge>
              </div>

              {t.role_current && (
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Currently:</span> {t.role_current}
                </p>
              )}

              {skillTags(t.skills).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Top skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillTags(t.skills).map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {t.portfolio_url ? (
                  <a href={t.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View portfolio <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </a>
                ) : (
                  <Button variant="outline" size="sm" className="flex-1" disabled>
                    No portfolio link
                  </Button>
                )}
                <Button size="sm" className="flex-1" onClick={() => openIntro(t)}>
                  <Send className="h-3 w-3 mr-1" /> Make intro
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!introTarget} onOpenChange={(o) => { if (!o) setIntroTarget(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request an introduction</DialogTitle>
            <DialogDescription>
              Tell us about the role and why this candidate is a fit. The admin will be notified and will connect you directly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Your name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label>Your email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
            </div>
            <div className="space-y-1.5">
              <Label>Company (optional)</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} maxLength={150} />
            </div>
            <div className="space-y-1.5">
              <Label>Message *</Label>
              <Textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Role, location, timeline, and what you'd like to discuss…"
                maxLength={1500}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIntroTarget(null)} disabled={submitting}>Cancel</Button>
            <Button onClick={submitIntro} disabled={submitting}>
              {submitting ? "Sending…" : "Send request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TalentPoolShowcase;
