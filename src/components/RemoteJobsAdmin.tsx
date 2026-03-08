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
  is_active: boolean;
  created_at: string;
}

const emptyJob = {
  title: "",
  company_name: "",
  category: "",
  job_type: "Full-time",
  location: "Worldwide",
  salary: "",
  description: "",
  apply_url: "",
  is_active: true,
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];

const JOB_CATEGORIES = [
  "Software Development", "Customer Support", "Design", "Marketing",
  "Sales", "Product", "Business", "Data", "DevOps / Sysadmin",
  "Finance / Legal", "Human Resources", "QA", "Writing", "Other",
];

const RemoteJobsAdmin = () => {
  const [jobs, setJobs] = useState<RemoteJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<RemoteJob | null>(null);
  const [formData, setFormData] = useState(emptyJob);
  const [saving, setSaving] = useState(false);

  const fetchJobs = async () => {
    const { data } = await supabase
      .from("remote_jobs")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenDialog = (job?: RemoteJob) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        company_name: job.company_name,
        category: job.category,
        job_type: job.job_type,
        location: job.location,
        salary: job.salary || "",
        description: job.description,
        apply_url: job.apply_url || "",
        is_active: job.is_active,
      });
    } else {
      setEditingJob(null);
      setFormData(emptyJob);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.company_name.trim()) {
      toast.error("Title and company name are required");
      return;
    }

    setSaving(true);
    const payload = {
      title: formData.title.trim(),
      company_name: formData.company_name.trim(),
      category: formData.category,
      job_type: formData.job_type,
      location: formData.location.trim(),
      salary: formData.salary.trim() || null,
      description: formData.description.trim(),
      apply_url: formData.apply_url.trim() || null,
      is_active: formData.is_active,
    };

    if (editingJob) {
      const { error } = await supabase
        .from("remote_jobs")
        .update(payload)
        .eq("id", editingJob.id);
      if (error) {
        toast.error("Failed to update job");
      } else {
        toast.success("Job updated");
        setDialogOpen(false);
        fetchJobs();
      }
    } else {
      const { error } = await supabase
        .from("remote_jobs")
        .insert(payload);
      if (error) {
        toast.error("Failed to add job");
      } else {
        toast.success("Job added");
        setDialogOpen(false);
        fetchJobs();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this remote job?")) return;
    const { error } = await supabase.from("remote_jobs").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete job");
    } else {
      toast.success("Job deleted");
      fetchJobs();
    }
  };

  const toggleActive = async (job: RemoteJob) => {
    const { error } = await supabase
      .from("remote_jobs")
      .update({ is_active: !job.is_active })
      .eq("id", job.id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      fetchJobs();
    }
  };

  if (loading) return <div className="text-muted-foreground">Loading remote jobs...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Remote Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? "Edit Remote Job" : "Add Remote Job"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Job Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {JOB_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select value={formData.job_type} onValueChange={(v) => setFormData({ ...formData, job_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Worldwide, US only"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Salary</Label>
                  <Input
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g. $80k - $120k"
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
                  placeholder="Job description..."
                  rows={4}
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
                {saving ? "Saving..." : editingJob ? "Update Job" : "Add Job"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No remote jobs added yet
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{job.title}</TableCell>
                  <TableCell>{job.company_name}</TableCell>
                  <TableCell><Badge variant="secondary">{job.category || "—"}</Badge></TableCell>
                  <TableCell>{job.job_type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={job.is_active ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleActive(job)}
                    >
                      {job.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(job)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(job.id)}>
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

export default RemoteJobsAdmin;
