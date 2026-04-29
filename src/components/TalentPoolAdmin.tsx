import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Mail, Eye, FileText, ExternalLink, Star, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STATUS_OPTIONS = ["new", "viewed", "reviewed", "contacted", "on hold", "placed"] as const;
import { toast } from "sonner";
import { format } from "date-fns";

const emptyForm = {
  name: "",
  email: "",
  industry: "",
  years_of_experience: "",
  role_current: "",
  role_desired: "",
  skills: "",
  education_level: "Not specified",
  portfolio_url: "",
  linkedin_url: "",
  additional_notes: "",
};

interface TalentPoolEntry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  industry: string;
  years_of_experience: string;
  role_current: string | null;
  role_desired: string | null;
  skills: string | null;
  education_level: string;
  work_authorization: string;
  linkedin_url: string | null;
  portfolio_url: string | null;
  availability: string;
  salary_expectation: string | null;
  resume_url: string | null;
  cover_letter_url: string | null;
  additional_notes: string | null;
  status: string;
  is_featured: boolean;
  created_at: string;
}

const TalentPoolAdmin = () => {
  const [entries, setEntries] = useState<TalentPoolEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<TalentPoolEntry | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addFeatured, setAddFeatured] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleAddPortfolio = async () => {
    if (!form.name || !form.email || !form.industry || !form.years_of_experience) {
      toast.error("Name, email, industry, and experience are required");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("talent_pool")
      .insert({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        industry: form.industry,
        years_of_experience: form.years_of_experience,
        role_current: form.role_current.trim() || null,
        role_desired: form.role_desired.trim() || null,
        skills: form.skills.trim() || null,
        education_level: form.education_level || "Not specified",
        work_authorization: "N/A",
        availability: "N/A",
        portfolio_url: form.portfolio_url.trim() || null,
        linkedin_url: form.linkedin_url.trim() || null,
        additional_notes: form.additional_notes.trim() || null,
        is_featured: addFeatured,
        status: "reviewed",
      })
      .select()
      .single();
    setSaving(false);
    if (error) {
      toast.error("Failed to add portfolio");
      return;
    }
    setEntries([data as TalentPoolEntry, ...entries]);
    setForm(emptyForm);
    setAddFeatured(true);
    setAddOpen(false);
    toast.success("Portfolio added");
  };

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("talent_pool")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load talent pool entries");
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("talent_pool")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      setEntries(entries.map(e => e.id === id ? { ...e, status } : e));
      toast.success("Status updated");
    }
  };

  const handleToggleFeatured = async (id: string, is_featured: boolean) => {
    const { error } = await supabase
      .from("talent_pool")
      .update({ is_featured })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update featured status");
    } else {
      setEntries(entries.map(e => e.id === id ? { ...e, is_featured } : e));
      toast.success(is_featured ? "Profile featured publicly" : "Profile removed from showcase");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this talent pool entry?")) return;
    const { error } = await supabase
      .from("talent_pool")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete");
    } else {
      setEntries(entries.filter(e => e.id !== id));
      if (selectedEntry?.id === id) setSelectedEntry(null);
      toast.success("Entry deleted");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800 border-blue-200";
      case "viewed": return "bg-slate-100 text-slate-800 border-slate-200";
      case "reviewed": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "contacted": return "bg-purple-100 text-purple-800 border-purple-200";
      case "on hold": return "bg-orange-100 text-orange-800 border-orange-200";
      case "placed": return "bg-green-100 text-green-800 border-green-200";
      default: return "";
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground">
          {entries.length === 0
            ? "No talent pool submissions yet."
            : `${entries.filter(e => e.status === "new").length} new submission(s)`}
        </p>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Portfolio
        </Button>
      </div>
      {entries.length > 0 && (
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Featured</span>
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Docs</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell className="text-sm">{entry.industry}</TableCell>
                <TableCell className="text-sm">{entry.years_of_experience}</TableCell>
                <TableCell>
                  <Select value={entry.status} onValueChange={(v) => handleUpdateStatus(entry.id, v)}>
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue>
                        <Badge className={statusColor(entry.status)}>{entry.status}</Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={!!entry.is_featured}
                    onCheckedChange={(checked) => handleToggleFeatured(entry.id, checked)}
                  />
                </TableCell>
                <TableCell className="text-sm">{format(new Date(entry.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {entry.resume_url && (
                      <a href={entry.resume_url} target="_blank" rel="noopener noreferrer" title="Resume">
                        <FileText className="h-4 w-4 text-primary" />
                      </a>
                    )}
                    {entry.cover_letter_url && (
                      <a href={entry.cover_letter_url} target="_blank" rel="noopener noreferrer" title="Cover Letter">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => setSelectedEntry(entry)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(entry.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={(open) => { if (!open) setSelectedEntry(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEntry?.name}</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-muted-foreground">Email</p>
                  <a href={`mailto:${selectedEntry.email}`} className="text-primary hover:underline flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {selectedEntry.email}
                  </a>
                </div>
                {selectedEntry.phone && (
                  <div>
                    <p className="font-medium text-muted-foreground">Phone</p>
                    <p>{selectedEntry.phone}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-muted-foreground">Industry</p>
                  <p>{selectedEntry.industry}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Experience</p>
                  <p>{selectedEntry.years_of_experience}</p>
                </div>
                {selectedEntry.role_current && (
                  <div>
                    <p className="font-medium text-muted-foreground">Current Role</p>
                    <p>{selectedEntry.role_current}</p>
                  </div>
                )}
                {selectedEntry.role_desired && (
                  <div>
                    <p className="font-medium text-muted-foreground">Desired Role</p>
                    <p>{selectedEntry.role_desired}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-muted-foreground">Education</p>
                  <p>{selectedEntry.education_level}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Work Authorization</p>
                  <p>{selectedEntry.work_authorization}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Availability</p>
                  <p>{selectedEntry.availability}</p>
                </div>
                {selectedEntry.salary_expectation && (
                  <div>
                    <p className="font-medium text-muted-foreground">Salary Expectation</p>
                    <p>{selectedEntry.salary_expectation}</p>
                  </div>
                )}
              </div>
              {selectedEntry.skills && (
                <div>
                  <p className="font-medium text-muted-foreground">Skills</p>
                  <p>{selectedEntry.skills}</p>
                </div>
              )}
              {selectedEntry.additional_notes && (
                <div>
                  <p className="font-medium text-muted-foreground">Additional Notes</p>
                  <p>{selectedEntry.additional_notes}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                {selectedEntry.resume_url && (
                  <a href={selectedEntry.resume_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" /> Resume
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </a>
                )}
                {selectedEntry.cover_letter_url && (
                  <a href={selectedEntry.cover_letter_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" /> Cover Letter
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </a>
                )}
                {selectedEntry.linkedin_url && (
                  <a href={selectedEntry.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      LinkedIn <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </a>
                )}
                {selectedEntry.portfolio_url && (
                  <a href={selectedEntry.portfolio_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      Portfolio <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Portfolio Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Portfolio Manually</DialogTitle>
            <DialogDescription>
              Create a talent pool entry directly. Toggle "Feature publicly" to show it on the Talent Pool page (anonymous fields only).
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
            </div>
            <div className="space-y-1.5">
              <Label>Industry *</Label>
              <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g. Technology / IT" maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label>Years of Experience *</Label>
              <Input value={form.years_of_experience} onChange={(e) => setForm({ ...form, years_of_experience: e.target.value })} placeholder="e.g. 3-5 years" maxLength={50} />
            </div>
            <div className="space-y-1.5">
              <Label>Current Role</Label>
              <Input value={form.role_current} onChange={(e) => setForm({ ...form, role_current: e.target.value })} maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label>Desired Role</Label>
              <Input value={form.role_desired} onChange={(e) => setForm({ ...form, role_desired: e.target.value })} maxLength={200} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Skills</Label>
              <Textarea value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Comma-separated" maxLength={500} />
            </div>
            <div className="space-y-1.5">
              <Label>Education Level</Label>
              <Input value={form.education_level} onChange={(e) => setForm({ ...form, education_level: e.target.value })} maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label>Portfolio URL</Label>
              <Input value={form.portfolio_url} onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })} placeholder="https://" maxLength={255} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>LinkedIn URL</Label>
              <Input value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." maxLength={255} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Internal Notes</Label>
              <Textarea value={form.additional_notes} onChange={(e) => setForm({ ...form, additional_notes: e.target.value })} maxLength={1000} />
            </div>
            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <Switch checked={addFeatured} onCheckedChange={setAddFeatured} />
              <Label className="cursor-pointer" onClick={() => setAddFeatured(!addFeatured)}>
                Feature publicly on Talent Pool page
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleAddPortfolio} disabled={saving}>
              {saving ? "Saving..." : "Add Portfolio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TalentPoolAdmin;
