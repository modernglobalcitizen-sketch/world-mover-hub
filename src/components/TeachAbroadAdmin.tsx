import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface TeachAbroadProgram {
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
  is_active: boolean;
  created_at: string;
}

export const REGIONS = [
  "Asia", "Europe", "Middle East", "Latin America", "Africa", "North America", "Oceania", "Other",
];

export const SUBJECTS = [
  "English", "Math", "Science", "Early Childhood", "Special Education",
  "Business", "Arts", "Physical Education", "Other",
];

const emptyProgram = {
  program_name: "",
  organization: "",
  country: "",
  region: "Asia",
  subject: "English",
  contract_length: "",
  salary: "",
  requirements: "",
  benefits: "",
  description: "",
  apply_url: "",
  deadline: "",
  is_active: true,
};

const TeachAbroadAdmin = () => {
  const [programs, setPrograms] = useState<TeachAbroadProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TeachAbroadProgram | null>(null);
  const [formData, setFormData] = useState(emptyProgram);
  const [saving, setSaving] = useState(false);

  const fetchPrograms = async () => {
    const { data } = await supabase
      .from("teach_abroad_programs")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPrograms(data as TeachAbroadProgram[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleOpenDialog = (program?: TeachAbroadProgram) => {
    if (program) {
      setEditing(program);
      setFormData({
        program_name: program.program_name,
        organization: program.organization,
        country: program.country,
        region: program.region,
        subject: program.subject,
        contract_length: program.contract_length || "",
        salary: program.salary || "",
        requirements: program.requirements || "",
        benefits: program.benefits || "",
        description: program.description || "",
        apply_url: program.apply_url || "",
        deadline: program.deadline || "",
        is_active: program.is_active,
      });
    } else {
      setEditing(null);
      setFormData(emptyProgram);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.program_name.trim() || !formData.organization.trim() || !formData.country.trim()) {
      toast.error("Program name, organization and country are required");
      return;
    }

    setSaving(true);
    const payload = {
      program_name: formData.program_name.trim(),
      organization: formData.organization.trim(),
      country: formData.country.trim(),
      region: formData.region,
      subject: formData.subject,
      contract_length: formData.contract_length.trim() || null,
      salary: formData.salary.trim() || null,
      requirements: formData.requirements.trim() || null,
      benefits: formData.benefits.trim() || null,
      description: formData.description.trim(),
      apply_url: formData.apply_url.trim() || null,
      deadline: formData.deadline || null,
      is_active: formData.is_active,
    };

    const { error } = editing
      ? await supabase.from("teach_abroad_programs").update(payload).eq("id", editing.id)
      : await supabase.from("teach_abroad_programs").insert(payload);

    if (error) {
      toast.error(editing ? "Failed to update program" : "Failed to add program");
    } else {
      toast.success(editing ? "Program updated" : "Program added");
      setDialogOpen(false);
      fetchPrograms();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this teach abroad program?")) return;
    const { error } = await supabase.from("teach_abroad_programs").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete program");
    } else {
      toast.success("Program deleted");
      fetchPrograms();
    }
  };

  const toggleActive = async (program: TeachAbroadProgram) => {
    const { error } = await supabase
      .from("teach_abroad_programs")
      .update({ is_active: !program.is_active })
      .eq("id", program.id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      fetchPrograms();
    }
  };

  if (loading) return <div className="text-muted-foreground">Loading teach abroad programs...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Program" : "Add Teach Abroad Program"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Program Name *</Label>
                <Input
                  value={formData.program_name}
                  onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
                  placeholder="e.g. JET Programme"
                />
              </div>
              <div className="space-y-2">
                <Label>Organization / School *</Label>
                <Input
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. Japanese Ministry of Education"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. Japan"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contract Length</Label>
                  <Input
                    value={formData.contract_length}
                    onChange={(e) => setFormData({ ...formData, contract_length: e.target.value })}
                    placeholder="e.g. 12 months"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salary</Label>
                  <Input
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g. $2,000/month"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Apply URL</Label>
                <Input
                  value={formData.apply_url}
                  onChange={(e) => setFormData({ ...formData, apply_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="What the program offers..."
                />
              </div>
              <div className="space-y-2">
                <Label>Requirements</Label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={3}
                  placeholder="e.g. Bachelor's degree, TEFL certificate"
                />
              </div>
              <div className="space-y-2">
                <Label>Benefits</Label>
                <Textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows={3}
                  placeholder="e.g. Free housing, flight reimbursement"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSave} className="w-full" disabled={saving}>
                {saving ? "Saving..." : editing ? "Update Program" : "Add Program"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No teach abroad programs added yet
                </TableCell>
              </TableRow>
            ) : (
              programs.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{p.program_name}</TableCell>
                  <TableCell>{p.country}</TableCell>
                  <TableCell><Badge variant="secondary">{p.subject}</Badge></TableCell>
                  <TableCell>{p.salary || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={p.is_active ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleActive(p)}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeachAbroadAdmin;
