import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Calendar, ExternalLink, GraduationCap, Search, Clock, Wallet } from "lucide-react";
import { format } from "date-fns";

interface Program {
  id: string;
  program_name: string;
  organization: string;
  country: string;
  region: string;
  subject: string;
  contract_length: string | null;
  salary: string | null;
  requirements: string | null;
  benefits: string | null;
  description: string;
  apply_url: string | null;
  deadline: string | null;
}

const TeachAbroad = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [subject, setSubject] = useState("all");

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data } = await supabase
        .from("teach_abroad_programs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data) setPrograms(data as Program[]);
      setLoading(false);
    };
    fetchPrograms();
  }, []);

  const regions = useMemo(
    () => Array.from(new Set(programs.map((p) => p.region))).sort(),
    [programs]
  );
  const subjects = useMemo(
    () => Array.from(new Set(programs.map((p) => p.subject))).sort(),
    [programs]
  );

  const filtered = programs.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.program_name.toLowerCase().includes(q) ||
      p.organization.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q);
    return (
      matchesSearch &&
      (region === "all" || p.region === region) &&
      (subject === "all" || p.subject === subject)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <SEO
        title="Teach Abroad Programs Directory — Global Moves Network"
        description="Browse verified teach abroad programs by country, region and subject. Salaries, requirements, benefits and application links in one directory."
        path="/teach-abroad"
      />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30">
          <div className="container py-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <GraduationCap className="h-4 w-4" />
              Teach Abroad Directory
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-headline mb-3">
              Teach Abroad Programs
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              A curated directory of teaching programs around the world — salaries, requirements,
              benefits and how to apply, all in one place.
            </p>
          </div>
        </section>

        <section className="container py-10">
          <div className="grid gap-3 md:grid-cols-[1fr_200px_200px] mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search program, school or country"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger><SelectValue placeholder="Region" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading programs...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No teach abroad programs listed yet. Check back soon.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((p) => (
                <Card key={p.id} className="flex flex-col">
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{p.subject}</Badge>
                      <Badge variant="outline">{p.region}</Badge>
                    </div>
                    <CardTitle className="text-xl leading-snug">{p.program_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{p.organization}</p>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 gap-4">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />{p.country}
                      </span>
                      {p.contract_length && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />{p.contract_length}
                        </span>
                      )}
                      {p.salary && (
                        <span className="flex items-center gap-1.5">
                          <Wallet className="h-4 w-4" />{p.salary}
                        </span>
                      )}
                      {p.deadline && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(p.deadline), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>

                    {p.description && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                        {p.description}
                      </p>
                    )}

                    {(p.requirements || p.benefits) && (
                      <Accordion type="single" collapsible>
                        {p.requirements && (
                          <AccordionItem value="req">
                            <AccordionTrigger className="text-sm">Requirements</AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {p.requirements}
                            </AccordionContent>
                          </AccordionItem>
                        )}
                        {p.benefits && (
                          <AccordionItem value="ben">
                            <AccordionTrigger className="text-sm">Benefits</AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {p.benefits}
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </Accordion>
                    )}

                    <div className="mt-auto pt-2">
                      {p.apply_url ? (
                        <Button asChild className="w-full">
                          <a href={p.apply_url} target="_blank" rel="noopener noreferrer">
                            Apply Now
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Application link coming soon
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TeachAbroad;
